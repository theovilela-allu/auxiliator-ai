#!/usr/bin/env node
// Passa o bastao: grava a mensagem de abertura no sinal deste terminal e derruba esta sessao
// (arvore inteira: claude.exe, ajudantes e o navegador, que senao segura a trava do perfil).
// O laco da funcao claude no profile.ps1 ve o sinal e relanca no mesmo terminal, com a flag.
// Uso: node .claude/hooks/passar-o-bastao.cjs [--seco] [--forcado]
//   --seco     so mostra o que faria
//   --forcado  passa o bastao mesmo com estado por salvar (ver TRAVA DE ESTADO SALVO)
// Desenho: memory/00-guia/passagem-de-bastao.md
//
// Por que o matador nasce via WMI e nao como filho meu: a ferramenta que roda este script derruba
// a propria arvore de processos quando termina, entao um filho "destacado" (spawn detached) morre
// antes de acordar. Provado em 02/09/2026: a primeira passagem real falhou exatamente por isso.
// Win32_Process.Create cria o processo debaixo do servico do WMI, fora da minha arvore, e ele
// sobrevive ao fim da ferramenta.
const fs = require('fs');
const { execFileSync } = require('child_process');
const path = require('path');

// O caderno. Existe porque em 04/09/2026 uma passagem falhou e nao sobrou registro
// de NADA: nem de qual sessao ele mirou, nem se o matador chegou a nascer. A
// investigacao virou adivinhacao. Uma linha por tentativa custa nada.
const CADERNO = path.join(process.env.USERPROFILE || process.env.HOME || '.', '.claude', 'bastao.log');
function anota(linha) {
  try { fs.appendFileSync(CADERNO, `${new Date().toISOString()}  ${linha}\n`, 'utf8'); } catch (_) {}
}

const MENSAGEM = 'bom dia, da uma lida pra pegar contexto. MODO AUTONOMO: voce nao esta aqui, entao le a passagem de bastao, entende onde a gente parou e segue trabalhando sozinho no que ficou pra fazer.';
const seco = process.argv.includes('--seco');
const sinal = process.env.BASTAO_SINAL;

// roda um script PowerShell sem briga de aspas: vai codificado em base64 (UTF-16LE)
function ps(script) {
  const enc = Buffer.from("$ProgressPreference = 'SilentlyContinue'\n" + script, 'utf16le').toString('base64');
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

// ---------------------------------------------------------------------------
// CONFERENCIA CRUZADA (05/09/2026). Duas coisas independentes dizem quem sou eu, e
// elas TEM que concordar:
//   1. a cadeia de processo, que diz qual claude.exe esta acima de mim;
//   2. o nome do arquivo de sinal, que diz qual terminal tem o laco que vai relancar.
// Se discordarem, matar o alvo derruba uma sessao IRMA e o relanco nasce no terminal
// errado — exatamente o que se suspeitou em 04/09/2026, com seis sessoes abertas e
// tres claude.exe vivos. Sem esta conferencia isso falha em silencio.
const terminal = Number((path.basename(String(sinal)).match(/bastao-(\d+)\./) || [])[1]);
let donoOk = !terminal;                       // sinal com nome fora do padrao: nao da pra conferir
let subida = [];
if (terminal) {
  let q = alvo;
  for (let i = 0; i < 6 && q; i++) {
    const p = info(q);
    if (!p) break;
    subida.push(`${p.name}(${q})`);
    if (p.ppid === terminal) { donoOk = true; subida.push(`terminal(${terminal})`); break; }
    if (!p.ppid || p.ppid === q) break;
    q = p.ppid;
  }
}
if (!donoOk) {
  const aviso = `RECUSEI: o claude.exe ${alvo} nao esta debaixo do terminal ${terminal} dono do sinal. ` +
                `Subida: ${subida.join(' <- ')}. Matar ele derrubaria outra sessao.`;
  console.log(aviso);
  console.log('Passe o bastao na mao: encerre esta sessao e cole na proxima:\n' + MENSAGEM);
  anota(aviso);
  process.exit(1);
}

// ---------------------------------------------------------------------------
// TRAVA DE ESTADO SALVO (03/09/2026). Ele perguntou se o gancho estava
// interrompendo o agente ANTES de ele salvar o que estava fazendo. Nao estava: o
// gancho Stop so devolve a lista de fechamento, e quem mata a sessao e o proprio
// agente, aqui, no passo 5. Mas nada VERIFICAVA que os passos 2 e 3 (reescrever
// a secao Estado e commitar) tinham acontecido — era instrucao, nao garantia.
// Agora e garantia: sem estado fresco e arvore limpa, este script recusa morrer.
const MINUTOS = 15;
const forcado = process.argv.includes('--forcado');
const raiz = process.env.CLAUDE_PROJECT_DIR || process.cwd();
const passagem = path.join(raiz, 'memory', '00-guia', 'passagem-de-bastao.md');
const recusas = [];

if (fs.existsSync(passagem)) {
  const idade = (Date.now() - fs.statSync(passagem).mtimeMs) / 60000;
  if (idade > MINUTOS) recusas.push(`a passagem nao e reescrita ha ${Math.round(idade)} min (passo 2)`);
} else {
  console.log(`Aviso: nao existe ${passagem}; sigo sem conferir o estado salvo.`);
}
// so o que o git ja rastreia: rascunho solto na pasta nao e estado perdido
let sujo = '';
try {
  sujo = execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], {
    cwd: raiz, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
} catch (_) {}
if (sujo) recusas.push(`${sujo.split('\n').length} arquivo(s) alterado(s) sem commit (passo 3)`);

if (recusas.length && !forcado) {
  console.log('NAO PASSEI O BASTAO, porque o estado ainda nao esta salvo: ' + recusas.join('; ') + '.');
  console.log('Faca os passos 2 e 3 primeiro: reescreva a secao Estado da passagem com onde voce parou, depois commit e push.');
  console.log('Feito isso, rode este script de novo. Se voce tem certeza de que nao ha o que salvar, rode com --forcado.');
  anota('RECUSEI (estado por salvar): ' + recusas.join('; '));
  process.exit(1);
}

// o matador: espera 2s e derruba a arvore do claude.exe. Nasce pelo WMI, fora da minha arvore.
const matador = `powershell.exe -NoProfile -NonInteractive -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; taskkill /F /T /PID ${alvo} | Out-Null"`;
const criar = [
  `$r = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{ CommandLine = '${matador.replace(/'/g, "''")}' }`,
  `"$($r.ReturnValue) $($r.ProcessId)"`,
].join('\n');

if (seco) {
  console.log(`[seco] alvo=${alvo} cadeia=${cadeia.join(' <- ')} sinal=${sinal}`);
  console.log(`[seco] conferencia cruzada: terminal=${terminal} dono=${donoOk ? 'CONFERE' : 'NAO CONFERE'} subida=${subida.join(' <- ')}`);
  console.log(`[seco] mensagem=${MENSAGEM}`);
  console.log(`[seco] matador=${matador}`);
  process.exit(0);
}

fs.writeFileSync(sinal, MENSAGEM + '\n', 'utf8');

let ret = '';
try { ret = ps(criar); } catch (e) { ret = 'erro ' + (e.message || e); }
const m = ret.match(/^(\d+)\s+(\d*)$/);
if (!m || m[1] !== '0') {
  anota(`FALHOU o WMI (retorno ${ret}) mirando claude.exe ${alvo}, terminal ${terminal}.`);
  console.log(`Nao consegui disparar o matador pelo WMI (retorno: ${ret}). Sinal ja gravado em ${sinal}.`);
  console.log(`Passe o bastao na mao: encerre esta sessao (o laco relanca sozinho) ou rode: taskkill /F /T /PID ${alvo}`);
  process.exit(0);
}

anota(`DISPAREI: alvo claude.exe ${alvo}, terminal ${terminal}, matador pid ${m[2]}, cadeia ${cadeia.join(' <- ')}.`);
console.log(`Bastao passado: sinal gravado em ${sinal}. Matador nasceu pelo WMI (pid ${m[2]}); esta sessao (claude.exe ${alvo}) encerra em 2 segundos e a proxima nasce neste terminal com a mensagem de abertura.`);
process.exit(0);
