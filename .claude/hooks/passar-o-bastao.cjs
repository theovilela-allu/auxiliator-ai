#!/usr/bin/env node
// Passa o bastao: grava a mensagem de abertura no sinal deste terminal e derruba esta sessao
// (arvore inteira: claude.exe, ajudantes e o navegador, que senao segura a trava do perfil).
// O laco da funcao claude no profile.ps1 ve o sinal e relanca no mesmo terminal, com a flag.
// Uso: node .claude/hooks/passar-o-bastao.cjs [--seco]   (--seco so mostra o que faria)
// Desenho: memory/00-guia/passagem-de-bastao.md
const fs = require('fs');
const { execFileSync, spawn } = require('child_process');

const MENSAGEM = 'bom dia, da uma lida pra pegar contexto. MODO AUTONOMO: voce nao esta aqui, entao le a passagem de bastao, entende onde a gente parou e segue trabalhando sozinho no que ficou pra fazer.';
const seco = process.argv.includes('--seco');
const sinal = process.env.BASTAO_SINAL;

// nome e pai de um processo, via WMI
function info(pid) {
  const out = execFileSync('powershell.exe', [
    '-NoProfile', '-NonInteractive', '-Command',
    `$p = Get-CimInstance Win32_Process -Filter "ProcessId=${pid}" | Select-Object -First 1; if ($p) { "$($p.ParentProcessId) $($p.Name)" }`,
  ], { encoding: 'utf8', windowsHide: true }).trim();
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
if (seco) {
  console.log(`[seco] alvo=${alvo} cadeia=${cadeia.join(' <- ')} sinal=${sinal}`);
  console.log(`[seco] mensagem=${MENSAGEM}`);
  process.exit(0);
}

fs.writeFileSync(sinal, MENSAGEM + '\n', 'utf8');

// matador destacado: espera 2s e derruba a arvore do claude.exe. Quando ele acorda, quem o disparou
// (este node e o shell da ferramenta) ja morreu, entao ele nao esta na arvore e sobrevive ao golpe.
const ps = `Start-Sleep -Seconds 2; taskkill /F /T /PID ${alvo} | Out-Null`;
const child = spawn('powershell.exe', ['-NoProfile', '-NonInteractive', '-WindowStyle', 'Hidden', '-Command', ps], {
  detached: true, stdio: 'ignore', windowsHide: true,
});
child.unref();

console.log(`Bastao passado: sinal gravado em ${sinal}. Esta sessao (claude.exe ${alvo}) encerra em 2 segundos e a proxima nasce neste terminal com a mensagem de abertura.`);
process.exit(0);
