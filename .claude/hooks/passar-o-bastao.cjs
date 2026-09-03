#!/usr/bin/env node
// Passa o bastao: grava a mensagem de abertura no sinal deste terminal e derruba esta sessao
// (arvore inteira: claude.exe, ajudantes e o navegador, que senao segura a trava do perfil).
// O laco da funcao claude no profile.ps1 ve o sinal e relanca no mesmo terminal, com a flag.
// Uso: node .claude/hooks/passar-o-bastao.cjs [--seco]   (--seco so mostra o que faria)
// Desenho: memory/00-guia/passagem-de-bastao.md
//
// Por que o matador nasce via WMI e nao como filho meu: a ferramenta que roda este script derruba
// a propria arvore de processos quando termina, entao um filho "destacado" (spawn detached) morre
// antes de acordar. Provado em 02/09/2026: a primeira passagem real falhou exatamente por isso.
// Win32_Process.Create cria o processo debaixo do servico do WMI, fora da minha arvore, e ele
// sobrevive ao fim da ferramenta.
const fs = require('fs');
const { execFileSync } = require('child_process');

const MENSAGEM = 'bom dia, da uma lida pra pegar contexto. MODO AUTONOMO: voce nao esta aqui, entao le a passagem de bastao, entende onde a gente parou e segue trabalhando sozinho no que ficou pra fazer.';
const seco = process.argv.includes('--seco');
const sinal = process.env.BASTAO_SINAL;

// roda um script PowerShell sem briga de aspas: vai codificado em base64 (UTF-16LE)
function ps(script) {
  const enc = Buffer.from('$ProgressPreference = \x27SilentlyContinue\x27
' + script, 'utf16le').toString('base64');
  return execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-EncodedCommand', enc], {
    encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
}

// nome e pai de um processo, via WMI
function info(pid) {
  const out = ps(`$p = Get-CimInstance Win32_Process -Filter "ProcessId=${pid}" | Select-Object -First 1; if ($p) { "$($p.ParentProcessId) $($p.Name)" }`);
  const m = out.match(/^(\d+)\s+(.+)$/);
  return m ? { ppid: Number(m[1]), name: m[2] } : null;
}

// subo a arvore a partir de mim ate achar o claude.exe desta sessao
let alvo = null;
let cadeia = [];
let pid = process.pid;
for (let i = 0; i < 12; i++) {
  const p = info(pid);
  if (!p) break;
  cadeia.push(`${p.name}(${pid})`);
  if (/^claude(\.exe)?$/i.test(p.name)) { alvo = pid; break; }
  if (!p.ppid || p.ppid === pid) break;
  pid = p.ppid;
}

if (!alvo) {
  console.log('Nao achei o claude.exe acima de mim (' + cadeia.join(' <- ') + '). Nada foi encerrado.');
  console.log('Passe o bastao na mao: feche esta sessao, abra outra e cole:\n' + MENSAGEM);
  process.exit(0);
}
if (!sinal) {
  console.log('Sem BASTAO_SINAL: esta sessao nao foi aberta pela funcao claude do PowerShell, entao nao ha laco pra relancar. Nada foi encerrado.');
  console.log('Abra um terminal novo, rode claude e cole:\n' + MENSAGEM);
  process.exit(0);
}

// o matador: espera 2s e derruba a arvore do claude.exe. Nasce pelo WMI, fora da minha arvore.
const matador = `powershell.exe -NoProfile -NonInteractive -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; taskkill /F /T /PID ${alvo} | Out-Null"`;
const criar = [
  `$r = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{ CommandLine = '${matador.replace(/'/g, "''")}' }`,
  `"$($r.ReturnValue) $($r.ProcessId)"`,
].join('\n');

if (seco) {
  console.log(`[seco] alvo=${alvo} cadeia=${cadeia.join(' <- ')} sinal=${sinal}`);
  console.log(`[seco] mensagem=${MENSAGEM}`);
  console.log(`[seco] matador=${matador}`);
  process.exit(0);
}

fs.writeFileSync(sinal, MENSAGEM + '\n', 'utf8');

let ret = '';
try { ret = ps(criar); } catch (e) { ret = 'erro ' + (e.message || e); }
const m = ret.match(/^(\d+)\s+(\d*)$/);
if (!m || m[1] !== '0') {
  console.log(`Nao consegui disparar o matador pelo WMI (retorno: ${ret}). Sinal ja gravado em ${sinal}.`);
  console.log(`Passe o bastao na mao: encerre esta sessao (o laco relanca sozinho) ou rode: taskkill /F /T /PID ${alvo}`);
  process.exit(0);
}

console.log(`Bastao passado: sinal gravado em ${sinal}. Matador nasceu pelo WMI (pid ${m[2]}); esta sessao (claude.exe ${alvo}) encerra em 2 segundos e a proxima nasce neste terminal com a mensagem de abertura.`);
process.exit(0);
