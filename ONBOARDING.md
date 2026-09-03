# Auxiliator — o assistente que continua trabalhando quando você não está

Este guia instala, no **seu** computador, o mesmo arranjo que o Theo usa: um assistente que age sem
pedir permissão a cada passo, que **não morre quando a conversa fica longa demais** (ele passa o
bastão pra uma sessão nova sozinho), que **trabalha enquanto você dorme** e que, quando o último
agente termina o serviço, **desliga a máquina**.

> [!IMPORTANT]
> **Como usar este guia:** você não precisa executar nada à mão. Abra o Claude Code na pasta onde
> quer instalar e diga: *"lê esse guia e instala isso pra mim"*. Ele foi escrito pro assistente
> executar, com os arquivos prontos. Você só responde a **uma** pergunta, na Parte 1.

**Plataforma:** este arranjo foi construído e provado no **Windows 11 com PowerShell**. A Parte 10
diz o que muda no Mac e no Linux, e o que ali eu **não** testei.

---

## Índice

| Parte | O quê | Você precisa? |
|---|---|---|
| 1 | **Os limites** — o que o assistente nunca pode fazer | **Sim, responde 1 pergunta** |
| 2 | Agir sem pedir permissão (bypass permissions) | decide se topa o risco |
| 3 | A memória, que é o que dá continuidade | não |
| 4 | Plano em texto, sem tela de aprovação | não |
| 5 | A corrente do bastão (o coração da coisa) | não |
| 6 | Modo autônomo | não |
| 7 | A máquina não pode dormir | não |
| 8 | O último agente apaga a luz | não |
| 9 | Como usar no dia a dia | leitura |
| 10 | Mac, Linux, e quando dá errado | leitura |

---

## Parte 1 — Os limites, e esta é a primeira coisa

Tudo que vem depois desta parte dá ao assistente **muito** poder: ele escreve arquivos, roda
comandos, sobe código, trabalha de madrugada sozinho e desliga seu computador. O que segura isso não
é uma tela de permissão a cada passo — é **uma lista curta e fechada do que ele nunca faz**.

> [!WARNING]
> **AGENTE: pare aqui e pergunte à pessoa, antes de instalar qualquer coisa.**
>
> Pergunte, com estas palavras ou parecidas:
>
> *"Antes de eu instalar: eu vou passar a agir sem te pedir permissão a cada passo. O que segura
> isso é uma lista do que eu nunca posso fazer. Estes são os seis limites que o Theo usa — você
> topa começar com eles, quer tirar algum, ou quer acrescentar?"*
>
> Mostre a lista abaixo. Espere a resposta. **Só depois** continue a instalação.

### Os seis limites padrão (os do Theo)

1. **Nunca deletar arquivos do computador.** Nem os meus próprios rascunhos: em vez de apagar, eu
   esvazio o arquivo ou deixo onde está.
2. **Nunca apagar coisas em larga escala** — reset de banco, limpeza em massa, "apaga tudo isso".
   Isso é decisão sua, executada por você.
3. **Nunca assinar nada pago**, *mesmo que comece de graça*. Cadastro que pede cartão, teste
   gratuito que vira cobrança, upgrade de plano: nada.
4. **Nunca editar arquivo que não é da tarefa em curso.** Mexer no que está fora do que você pediu é
   proibido, mesmo com boa intenção.
5. **Nunca escrever numa pasta compartilhada que não é minha** (o OneDrive/Drive de outra pessoa,
   por exemplo). Ler pode; escrever não.
6. **Nunca subir informação sensível pra internet.** Dado da empresa, de terceiro, credencial,
   segredo: não vão pra lugar nenhum público.

**Por que uma lista fechada, e não "peça permissão quando tiver dúvida":** porque "na dúvida
pergunte" trava o assistente a noite inteira quando você não está. O desenho é o contrário: o
contorno do irreversível é definido uma vez, por escrito, e **dentro dele a velocidade é total**.

### AGENTE: o que fazer com a resposta

Crie `memory/20-como-trabalhar/o-que-eu-nao-posso-fazer.md` com a lista **que a pessoa aprovou**
(as seis acima, com as alterações que ela pedir), começando pelo aviso:

```markdown
> [!danger] Esta é a lista inteira. Não tem outra.
> Fora dela, tudo é permitido. Quando eu for agir, a pergunta não é "será que posso?",
> é "isso cai numa das seis?". Não cai: faço e reporto. Cai: não faço e devolvo pra ela.
```

E cite esse arquivo no `CLAUDE.md` (Parte 3) como **a única** fonte de limites.

---

## Parte 2 — Agir sem pedir permissão

**O que é.** Por padrão, o Claude Code pede autorização a cada comando. Com
`--dangerously-skip-permissions` ele para de pedir e simplesmente age.

**O risco, sem enfeite.** O nome tem "dangerously" por um motivo: um comando destrutivo passa sem
ninguém conferir. O que torna isso aceitável é a Parte 1 — a lista de limites — e o fato de você
usar isso numa máquina sua, num projeto seu. **Se você não confia na lista de limites, não ligue
esta parte.** O resto do guia funciona sem ela, só com mais cliques.

**Como ligar:** o jeito recomendado não é digitar a flag toda vez, é embutir no atalho (Parte 5, o
laço já sobe com ela). Se quiser só experimentar antes:

```powershell
claude.exe --dangerously-skip-permissions
```

**Um incômodo que vem junto, e o conserto está na Parte 4:** com o bypass ligado, a tela de aprovação
de plano continua aparecendo e perguntando se pode seguir. Isso trava o modo autônomo.

---

## Parte 3 — A memória, que é o que dá continuidade

Sem isso, cada conversa nova começa do zero e a corrente do bastão não serve pra nada — a sessão que
nasce não sabe o que a anterior estava fazendo.

**AGENTE: crie três coisas.**

**1) `CLAUDE.md` na raiz do projeto.** É o único arquivo lido inteiro em toda conversa, então
**mantenha curto** (mire em 1500 tokens). Ele deve dizer, no mínimo:

```markdown
# Seu assessor pessoal

## Identidade
Assessor pessoal de <NOME>. O que importa: clareza, tempo e decisões melhores no trabalho.
Leia `memory/MEMORY.md` no início de toda conversa.

## Princípios
1. Curto: 1 a 3 frases é o padrão.
2. Zero jargão técnico com ela.
3. Tenha opinião e defenda com educação.
4. Não bajule. Elogio só verdadeiro, específico e raro.
5. Admita quando não sabe.
6. Nunca invente dado.

## Autonomia
Máxima: lê livre, escreve sem perguntar, age em silêncio.
O ÚNICO limite é `memory/20-como-trabalhar/o-que-eu-nao-posso-fazer.md`. Tudo o resto, faça.

## Memória
`memory/` é a primeira parada de toda conversa, antes de qualquer outra fonte.
Leia `memory/MEMORY.md` (o índice) no início. Aprendeu algo durável? Salve lá e some 1 linha no índice.
```

**2) A pasta `memory/`,** com um `MEMORY.md` que é só um índice — **uma linha por anotação**, porque
ele carrega em toda conversa:

```markdown
# Índice de memória
> Uma linha por anotação. O detalhe vive no arquivo, lido sob demanda.

- **[PASSAGEM DE BASTÃO](00-guia/passagem-de-bastao.md)** — LEIA PRIMEIRO em sessão nova
- [O que eu não posso fazer](20-como-trabalhar/o-que-eu-nao-posso-fazer.md) — a lista fechada
```

**3) `memory/00-guia/passagem-de-bastao.md`,** com uma seção `## Estado` vazia. É aqui que cada
sessão escreve onde parou, e é a **primeira coisa** que a sessão seguinte lê.

> [!TIP]
> A pasta `memory/` funciona muito bem como vault do **Obsidian** — os links `[[assim]]` viram
> navegação e você enxerga o que o assistente sabe. Não é obrigatório: são arquivos de texto.

---

## Parte 4 — Plano em texto, sem tela de aprovação

**O problema.** Mesmo com o bypass ligado, quando o assistente entra em "plan mode" aparece uma tela
pedindo aprovação. Nas palavras do Theo: *"toda vez que eu tô aprovando um plano usando esse bypass
permissions, ele tá me perguntando se pode seguir assim, preciso de algo que tire isso."* E, no modo
autônomo, essa tela **trava a noite inteira** esperando alguém clicar.

**O conserto:** um gancho barra a *entrada* em plan mode e, na recusa, ensina o que fazer no lugar —
mostrar o plano em texto e executar na sequência. A saída fica livre, pra ele conseguir sair caso
você mesmo o coloque em plan mode.

**AGENTE: crie `.claude/hooks/sem-plan-mode.cjs`:**

```javascript
#!/usr/bin/env node
// Gancho PreToolUse em EnterPlanMode: plan mode desligado.
// So barro a ENTRADA; ExitPlanMode fica livre.
const out = {
  hookSpecificOutput: {
    hookEventName: 'PreToolUse',
    permissionDecision: 'deny',
    permissionDecisionReason: 'Plan mode esta desligado nesta casa. Planeje do mesmo jeito, mas em texto: mostre em 3 a 6 linhas o que vai fazer e em que ordem, e EXECUTE na sequencia, sem esperar OK; a pessoa interrompe se discordar.',
  },
};
process.stdout.write(JSON.stringify(out));
process.exit(0);
```

E registre em `.claude/settings.json`, dentro de `hooks.PreToolUse`:

```json
{ "matcher": "EnterPlanMode",
  "hooks": [{ "type": "command", "command": "node \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/sem-plan-mode.cjs" }] }
```

> [!CAUTION]
> **Caminho absoluto sempre.** Use `"$CLAUDE_PROJECT_DIR"/.claude/hooks/...`. Com caminho relativo o
> gancho simplesmente não roda quando o Claude abre a partir de outra pasta, e você não recebe erro
> nenhum — só o silêncio.

---

## Parte 5 — A corrente do bastão

**O problema que ela resolve.** Toda conversa tem um limite de contexto. Quando enche, você perde o
fio e precisa abrir outra sessão e reexplicar tudo. Se isso acontece de madrugada, o trabalho
simplesmente para.

**A ideia.** Passado um limite (500 mil tokens no padrão do Theo), o assistente **salva o estado na
memória, encerra a própria sessão e uma nova nasce no mesmo terminal**, já com uma mensagem de
abertura mandando ela ler onde a anterior parou e continuar sozinha.

São quatro peças:

| Peça | Onde | O que faz |
|---|---|---|
| Laço | `profile.ps1` | roda o `claude` em laço; se a sessão morreu deixando sinal, relança no mesmo terminal |
| Gancho `Stop` | `.claude/hooks/bastao-de-contexto.cjs` | ao fim de cada resposta, mede o contexto; passou do limite, manda a lista da passagem |
| Script | `.claude/hooks/passar-o-bastao.cjs` | grava a mensagem no sinal e derruba a sessão |
| Barra de status | `~/.claude/statusline.cjs` | mostra o contexto e avisa quando a passagem está a caminho |

### 5.1 — O laço

**AGENTE: acrescente ao `profile.ps1` da pessoa** (o caminho sai de `$PROFILE`; crie o arquivo se
não existir):

```powershell
# claude sempre com --dangerously-skip-permissions, e em laco: quando a sessao morre deixando um
# sinal de passagem de bastao, a proxima nasce AQUI MESMO, no mesmo terminal, com a mesma flag,
# ja com a mensagem do sinal como primeiro prompt.
# Saida de emergencia: digitar claude.exe (com extensao) pula esta funcao.
function claude {
    $exe = "$env:USERPROFILE\.local\bin\claude.exe"
    $sinal = "$env:USERPROFILE\.claude\bastao-$PID.sinal"
    $env:BASTAO_SINAL = $sinal
    if (Test-Path $sinal) { Set-Content -Path $sinal -Value '' -NoNewline -Encoding utf8 }
    $proximos = @($args)
    while ($true) {
        & $exe --dangerously-skip-permissions @proximos
        $msg = ''
        if (Test-Path $sinal) {
            $lido = Get-Content -Path $sinal -Raw -Encoding utf8
            if ($null -ne $lido) { $msg = $lido.Trim() }
        }
        if ($msg -eq '') { break }
        Set-Content -Path $sinal -Value '' -NoNewline -Encoding utf8
        # a sessao anterior morreu a forca: devolve o console ao normal
        $esc = [char]27
        [Console]::Out.Write("$esc[?1049l$esc[?1000l$esc[?1002l$esc[?1003l$esc[?1006l$esc[?2004l$esc[?25h$esc[0m")
        [Console]::TreatControlCAsInput = $false
        Clear-Host
        Write-Host "passagem de bastao: abrindo a proxima sessao neste terminal..." -ForegroundColor DarkGray
        Start-Sleep -Milliseconds 800
        $env:BASTAO_LIMITE = $null
        $proximos = @($msg)
    }
}
```

**AGENTE: confira o caminho do executável** (`$env:USERPROFILE\.local\bin\claude.exe`) com
`(Get-Command claude.exe).Source` e ajuste se for outro.

### 5.2 — O gancho que mede o contexto

**AGENTE: crie `.claude/hooks/bastao-de-contexto.cjs`.** Ele soma o último `usage` do fio principal
do transcript; passando do limite, devolve (código 2) a lista de fechamento pro assistente executar.

```javascript
#!/usr/bin/env node
// Gancho Stop: quando o contexto passa do limite, nao deixo a sessao parar quieta.
// Limite trocavel por BASTAO_LIMITE (so pra teste).
const fs = require('fs');
const LIMITE = Number(process.env.BASTAO_LIMITE) || 500000;

let raw = '';
try { raw = fs.readFileSync(0, 'utf8'); } catch (_) {}
let d = {};
try { d = JSON.parse(raw || '{}'); } catch (_) {}

if (d.stop_hook_active) process.exit(0);          // ja estou continuando por causa deste gancho
const tp = d.transcript_path;
if (!tp || !fs.existsSync(tp)) process.exit(0);
const marca = tp + '.bastao';                      // uma passagem por sessao
if (fs.existsSync(marca)) process.exit(0);

let ctx = null;
try {
  const fd = fs.openSync(tp, 'r');
  try {
    const size = fs.fstatSync(fd).size;
    const start = Math.max(0, size - 512 * 1024);
    const buf = Buffer.alloc(size - start);
    fs.readSync(fd, buf, 0, buf.length, start);
    const lines = buf.toString('utf8').split(/\r?\n/).filter(Boolean);
    for (let i = lines.length - 1; i >= 0; i--) {
      let o; try { o = JSON.parse(lines[i]); } catch (_) { continue; }
      if (o.isSidechain) continue;                 // ignora ajudantes
      if (o.type && o.type !== 'assistant') continue;
      const u = o.usage || (o.message && o.message.usage);
      if (u && (u.input_tokens != null || u.cache_read_input_tokens != null)) {
        ctx = (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0);
        break;
      }
    }
  } finally { fs.closeSync(fd); }
} catch (_) {}

if (ctx == null || ctx < LIMITE) process.exit(0);
try { fs.writeFileSync(marca, new Date().toISOString() + ' ctx=' + ctx + '\n'); } catch (_) {}

const k = Math.round(ctx / 1000);
process.stderr.write([
  `PASSAGEM DE BASTAO: o contexto chegou a ${k}k tokens (limite ${Math.round(LIMITE / 1000)}k). Nao pare aqui. Faca, nesta ordem, sem perguntar nada:`,
  `1. Deixe o trabalho num estado consistente: se um passo precisa terminar pra nao ficar meio feito, termine-o primeiro.`,
  `2. Reescreva a secao "Estado" de memory/00-guia/passagem-de-bastao.md: o que estavamos fazendo, o que ficou pronto, o que falta (em ordem), onde esta (branch, commit, arquivo), o proximo passo concreto, e o que depende dela.`,
  `3. Nota de projeto defasada nesta conversa: atualize tambem. Depois commit e push.`,
  `4. Diga a ela em UMA linha que a conversa ficou longa e voce vai passar o bastao pra uma sessao nova, que abre sozinha neste terminal.`,
  `5. Por ultimo, rode: node .claude/hooks/passar-o-bastao.cjs`,
].join('\n'));
process.exit(2);
```

Registre em `.claude/settings.json`:

```json
"Stop": [{ "hooks": [{ "type": "command",
  "command": "node \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/bastao-de-contexto.cjs", "timeout": 30 }] }]
```

### 5.3 — O script que passa o bastão

**AGENTE: crie `.claude/hooks/passar-o-bastao.cjs`.**

> [!CAUTION]
> **A armadilha que fez a primeira passagem real falhar.** O processo que derruba a sessão **não pode
> ser filho do agente**: a ferramenta que roda o script derruba a própria árvore ao terminar, então
> um filho "destacado" morre antes de acordar. Ele precisa nascer **pelo WMI**
> (`Win32_Process.Create`), que o cria debaixo do serviço do WMI, fora da árvore. E ele derruba a
> **árvore inteira** (`taskkill /F /T`), senão um navegador aberto pelo agente fica vivo segurando a
> trava do perfil.

```javascript
#!/usr/bin/env node
// Grava a mensagem de abertura no sinal deste terminal e derruba esta sessao (arvore inteira).
// Uso: node .claude/hooks/passar-o-bastao.cjs [--seco]
const fs = require('fs');
const { execFileSync } = require('child_process');

const MENSAGEM = 'bom dia, da uma lida pra pegar contexto. MODO AUTONOMO: voce nao esta aqui, entao le a passagem de bastao, entende onde a gente parou e segue trabalhando sozinho no que ficou pra fazer.';
const seco = process.argv.includes('--seco');
const sinal = process.env.BASTAO_SINAL;

function ps(script) {
  const enc = Buffer.from("$ProgressPreference = 'SilentlyContinue'\n" + script, 'utf16le').toString('base64');
  return execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-EncodedCommand', enc], {
    encoding: 'utf8', windowsHide: true, stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
}
function info(pid) {
  const out = ps(`$p = Get-CimInstance Win32_Process -Filter "ProcessId=${pid}" | Select-Object -First 1; if ($p) { "$($p.ParentProcessId) $($p.Name)" }`);
  const m = out.match(/^(\d+)\s+(.+)$/);
  return m ? { ppid: Number(m[1]), name: m[2] } : null;
}

let alvo = null, cadeia = [], pid = process.pid;
for (let i = 0; i < 12; i++) {
  const p = info(pid);
  if (!p) break;
  cadeia.push(`${p.name}(${pid})`);
  if (/^claude(\.exe)?$/i.test(p.name)) { alvo = pid; break; }
  if (!p.ppid || p.ppid === pid) break;
  pid = p.ppid;
}
if (!alvo) {
  console.log('Nao achei o claude.exe acima de mim. Nada foi encerrado.');
  console.log('Passe o bastao na mao: feche esta sessao, abra outra e cole:\n' + MENSAGEM);
  process.exit(0);
}
if (!sinal) {
  console.log('Sem BASTAO_SINAL: esta sessao nao foi aberta pela funcao claude, entao nao ha laco pra relancar.');
  console.log('Abra um terminal novo, rode claude e cole:\n' + MENSAGEM);
  process.exit(0);
}

const matador = `powershell.exe -NoProfile -NonInteractive -WindowStyle Hidden -Command "Start-Sleep -Seconds 2; taskkill /F /T /PID ${alvo} | Out-Null"`;
const criar = [
  `$r = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{ CommandLine = '${matador.replace(/'/g, "''")}' }`,
  `"$($r.ReturnValue) $($r.ProcessId)"`,
].join('\n');

if (seco) { console.log(`[seco] alvo=${alvo} sinal=${sinal}`); process.exit(0); }

fs.writeFileSync(sinal, MENSAGEM + '\n', 'utf8');
let ret = '';
try { ret = ps(criar); } catch (e) { ret = 'erro ' + (e.message || e); }
const m = ret.match(/^(\d+)\s+(\d*)$/);
if (!m || m[1] !== '0') {
  console.log(`Nao consegui disparar o matador pelo WMI (retorno: ${ret}). Sinal ja gravado.`);
  process.exit(0);
}
console.log(`Bastao passado. Esta sessao encerra em 2 segundos e a proxima nasce neste terminal.`);
process.exit(0);
```

### 5.4 — Escolher o limite, e este é o segundo ponto em que você decide

> [!WARNING]
> **AGENTE: pergunte à pessoa qual limite ela quer**, oferecendo o padrão:
>
> *"A partir de quanto de conversa eu devo salvar tudo e recomeçar sozinho? O Theo usa 500 mil, que
> numa janela de 1 milhão dá metade — sobra folga pra eu fechar o serviço direito. Serve pra você?"*

O limite vive em duas linhas, e as duas precisam bater:

- `bastao-de-contexto.cjs`: `const LIMITE = Number(process.env.BASTAO_LIMITE) || 500000;`
- `statusline.cjs` (5.5): o aviso laranja usa o mesmo número.

**Como escolher:** o limite é uma fração da janela de contexto do modelo. Metade é um bom ponto de
partida — passar muito disso e a sessão pode não ter fôlego pra escrever o estado direito antes de
morrer; muito abaixo e você troca de sessão à toa, perdendo contexto útil.

### 5.5 — A barra de status

Opcional, mas é o que faz você **ver** a corrente chegando. Crie `~/.claude/statusline.cjs` lendo o
JSON do stdin e escrevendo uma linha; registre em `~/.claude/settings.json`:

```json
"statusLine": { "type": "command", "command": "node \"<caminho>/statusline.cjs\"", "refreshInterval": 1 }
```

Duas coisas que valem copiar do original:

- **A escada de aviso:** cor normal até o limite, cor quente ao passar dele ("passagem a caminho"),
  vermelho bem acima ("a passagem falhou, olha isso"). É o único jeito de a barra avisar sem ninguém
  ler número.
- **Barra de progresso que lê bem no terminal:** cheio `█` na cor forte, vazio `█` numa versão bem
  clara da mesma cor. **Não** tente desenhar um contorno com linha em cima e embaixo: a linha de
  baixo só existe como sublinhado do terminal (que cai *fora* da célula) e a de cima só como glifo
  (que nasce *dentro* dela) — elas nunca alinham, e o resultado fica torto. E confira se a fonte do
  terminal tem o símbolo que você quer usar; símbolo que a fonte não tem vira ruído colado no texto.

### 5.6 — Testar sem esperar o limite

```powershell
# num terminal NOVO
$env:BASTAO_LIMITE = 1000
claude
```

A primeira resposta já passa o bastão. O laço zera essa variável antes de relançar, então a sessão
que nasce volta ao limite normal.

> [!CAUTION]
> `BASTAO_LIMITE` é variável **do terminal** e vale pra qualquer pasta. Se você abrir outro projeto
> no mesmo terminal do teste, ele vai passar o bastão na primeira resposta e parecer um bug.
> Conserto: `Remove-Item Env:BASTAO_LIMITE`, ou abra um terminal novo.

---

## Parte 6 — Modo autônomo

A mensagem que a sessão nova recebe começa com **"MODO AUTONOMO"**. É o gatilho de uma habilidade que
diz: *a pessoa não está aqui*.

**AGENTE: crie `.claude/skills/modo-autonomo/SKILL.md`:**

```markdown
---
name: modo-autonomo
description: Use quando a mensagem de abertura disser "MODO AUTONOMO", ou quando a pessoa pedir "trabalha sozinho", "segue sem mim", "eu não vou estar aqui". Ela NÃO está presente: eu leio a passagem de bastão, monto a fila do que ficou e trabalho sozinho, sem fazer pergunta e sem cair em trava.
---

# Modo autônomo

## A regra que manda em todas as outras
**Nenhuma pergunta, nenhum diálogo, nenhuma espera.** Decido, anoto e sigo. O que pede a palavra
dela vira item na lista "pra ela" e eu pulo pra próxima frente. Travas disfarçadas que eu não uso
aqui: perguntar de qualquer forma, entrar em plan mode, esperar login, esperar autorização,
"prefere A ou B?".

## Como começo
1. Leio, nesta ordem: `memory/00-guia/passagem-de-bastao.md` (seção Estado), `memory/MEMORY.md`, e o
   painel do projeto que a passagem apontar.
2. Confiro o chão: `git status`, branch e commit. Passagem desatualizada → o repositório manda, e eu
   corrijo a nota.
3. Monto a fila: os itens "MEU" da passagem, na ordem que ela dá. Sem item meu → o que sobrou nas
   notas e não depende dela. Nada disso → paro.
4. Me anuncio: `.claude/scripts/desligar.ps1 -Cheguei` (Parte 8). Isso também cancela desligamento
   pendente, o que protege a sessão recém-nascida.
5. Começo. Sem preâmbulo pra tela: ninguém está lendo.

## Como trabalho
- **Uma frente por vez**, até fechar ou até travar em coisa dela. Nunca duas frentes meio feitas.
- **Provo antes de dizer pronto.** Verde no build não é prova; o efeito real é.
- **Plano em texto**, cinco linhas na passagem, e executo.
- **Imprevisto que muda o rumo:** não decido de madrugada. Anoto, congelo a frente, vou pra próxima.
- **O relato vai pra memória, não pra tela.** Atualizo a passagem a cada frente fechada, não só no
  fim: se eu morrer no meio, o próximo sabe onde parei.

## Quando paro
- **Fila vazia:** escrevo o resumo na passagem (feito / falta / pra ela / onde está), commit, push,
  e chamo `.claude/scripts/desligar.ps1 -Terminei`.
- **Contexto no limite:** o gancho passa o bastão e a corrente continua.
- **Ela falou:** o modo acaba na hora. Abro com três linhas do que fiz enquanto ela não estava.

## O que eu nunca faço aqui
Perguntar. Esperar. Mandar mensagem em nome dela. Qualquer uma das proibições da lista de limites.
```

---

## Parte 7 — A máquina não pode dormir

Descoberta que custou uma tarde e vale ouro: **bloquear a tela (Win+L) não mata processo nenhum.** O
que mata o trabalho é a máquina **dormir** — e num notebook moderno isso acontece rápido.

> [!IMPORTANT]
> **O culpado que ninguém vê: a "suspensão não assistida".** Na máquina do Theo ela estava em **120
> segundos**. É a régua que manda justamente quando a máquina está *trancada*, e ela **não aparece em
> nenhuma tela do Windows** (é uma configuração escondida). Sem zerar essa, todo o resto é inútil:
> dois minutos depois de você bloquear, a máquina dorme e o agente para.

**AGENTE: zere os quatro tempos, guardando os valores anteriores.** Leia o valor atual do override em
`HKLM:\SYSTEM\CurrentControlSet\Control\Power\User\PowerSchemes\<esquema>\<sub>\<setting>` e, **quando
ele não existir**, caia no padrão de fábrica em `...\Power\PowerSettings\<sub>\<setting>\DefaultPowerSchemeValues\<esquema>`.

```powershell
$g = ((powercfg /getactivescheme) -join ' '); if ($g -match '([0-9a-fA-F-]{36})') { $guid = $Matches[1] }
$SLEEP = '238c9fa8-0aad-41ed-83f4-97be242c8f20'   # subgrupo: suspensao
$BTN   = '4f971e89-eebd-4455-a8de-9e59040e7347'   # subgrupo: botoes e tampa
$alvos = @(
  @($SLEEP, '29f6c1db-86da-48c5-9fdb-f2b67b1f44da'),  # suspender depois de
  @($SLEEP, '9d7815a6-7ee4-497e-8888-515a05f02364'),  # hibernar depois de
  @($SLEEP, '7bc4a2f9-d8fc-4469-b07b-33eb785aaca0'),  # suspensao NAO ASSISTIDA  <- o que pega
  @($BTN,   '5ca83367-6e45-459f-a27b-476b1d01c936')   # fechar a tampa
)
foreach ($a in $alvos) {
  powercfg -setacvalueindex $guid $a[0] $a[1] 0
  powercfg -setdcvalueindex $guid $a[0] $a[1] 0
}
powercfg -setactive $guid
```

> [!CAUTION]
> **Estas configurações são escondidas (`Attributes = 1`).** Elas não aparecem no `powercfg /query`
> e, enquanto ninguém mexer, **não existe chave de override no registro**. O `powercfg
> -setacvalueindex` grava mesmo assim, mas **apagar a chave depois exige administrador**. Ou seja:
> quem lê só o override lê nada, escreve por cima e não consegue desfazer. **Leia o padrão de fábrica
> antes, e anote os valores originais na memória** — sem esse registro não há como voltar.

**Dois caminhos a mais, e este pede um clique de administrador:**

```powershell
# 1) o Windows Update pode REINICIAR a maquina fora do "horario ativo" — justo de madrugada
New-Item -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU' -Force
New-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU' `
  -Name NoAutoRebootWithLoggedOnUsers -Value 1 -PropertyType DWord -Force
# 2) sem rede o agente para do mesmo jeito
Get-NetAdapter -Physical | Where-Object Status -eq 'Up' | ForEach-Object { Disable-NetAdapterPowerManagement -Name $_.Name -Confirm:$false }
```

**O único caminho de parada que fica de pé, e de propósito:** bateria crítica hiberna. Tirar isso
trocaria uma parada limpa por um desligamento no tapa, com perda de dado. A resposta é a tomada.

**Botões de ligar e de suspender: não mexa neles.** Apertar o botão é você mandando parar.

---

## Parte 8 — O último agente apaga a luz

Você fecha o notebook e vai dormir. Os agentes terminam. **Quem terminar por último desliga a
máquina.**

**Por que não dá pra olhar só os processos:** uma sessão do Claude Code **não morre quando acaba o
trabalho** — ela fica de pé esperando alguém falar. Então "existe processo vivo" não responde
"alguém ainda está trabalhando". Por isso a presença é **declarada** num arquivo por agente, e o
processo serve só pra saber se a declaração ainda vale (PID morto = anúncio velho, ignora).

**AGENTE: crie `.claude/scripts/desligar.ps1`** com esta lógica (o arquivo completo está no
repositório de referência, em `.claude/scripts/desligar.ps1`):

- `-Cheguei` → acha o `claude.exe` dono subindo a árvore de processos, grava
  `~/.claude/agentes/<pid>.json` com estado `trabalhando`, **e cancela desligamento pendente**.
- `-Terminei` → marca `pronto` e roda **as cinco travas**. Todas têm que passar:
  1. quem chama já se marcou como pronto;
  2. nenhum outro agente anunciado está `trabalhando` com PID vivo;
  3. **nenhum `claude.exe` vivo sem anúncio** — sessão não anunciada é gente usando a máquina;
  4. teclado e mouse parados há pelo menos **15 minutos** (via `GetLastInputInfo`);
  5. contagem regressiva de **120 s**, cancelável com `shutdown /a`.
- `-Estado` → quem está anunciado e o que travaria.

> [!CAUTION]
> **`shutdown /a` sem nada pendente escreve no canal de ERRO** ("o sistema não estava sendo
> desligado", 1116). Chamado direto do PowerShell com `$ErrorActionPreference = 'Stop'`, isso vira
> `NativeCommandError` e **aborta o script inteiro**. Chame pelo `cmd` com a saída engolida
> (`cmd /c "shutdown /a >nul 2>&1"`) e zere o `$LASTEXITCODE` depois.

**A amarração com a corrente do bastão:** `-Cheguei` começa cancelando o desligamento. Sem isso, um
agente terminando bem na hora em que outra sessão renasce poderia desligar a máquina no meio do
renascimento.

---

## Parte 9 — Como usar no dia a dia

| Você quer | Você diz / faz |
|---|---|
| Trabalhar junto | abre o terminal, digita `claude`, conversa normalmente |
| Sair e deixar rodando | *"trabalha sozinho, eu não vou estar aqui"* — e `Win+L` pra trancar |
| Saber onde ele parou | abre `memory/00-guia/passagem-de-bastao.md`, seção Estado |
| Ver se vai trocar de sessão | olha a cor da barra de status |
| Cancelar um desligamento | `shutdown /a` |
| Sair do laço | `claude.exe` (com extensão) pula a função do atalho |

**A primeira coisa que ele faz numa sessão nova** é ler a passagem de bastão. Se ela estiver
desatualizada, ele corrige — o repositório manda, não a nota.

---

## Parte 10 — Mac, Linux, e quando dá errado

### Mac e Linux

O arranjo foi construído e provado **no Windows**. Os conceitos são os mesmos; as peças mudam, e
**eu não testei estas equivalências**:

| Peça | Windows | Equivalente |
|---|---|---|
| Laço | função no `profile.ps1` | função `claude()` no `.zshrc`/`.bashrc`, mesmo desenho |
| Matador fora da árvore | `Win32_Process.Create` (WMI) | `setsid`/`nohup` com `disown`, ou `at now` |
| Não dormir | `powercfg` | macOS: `caffeinate -i -s`; Linux: `systemd-inhibit` |
| Desligar | `shutdown /s /t 120` | `sudo shutdown -h +2` (pede senha; talvez precise de `sudoers`) |
| Ociosidade | `GetLastInputInfo` | macOS: `ioreg -c IOHIDSystem` (HIDIdleTime) |

Os ganchos e as habilidades (`.claude/hooks`, `.claude/skills`) funcionam igual nos três sistemas.

### Quando dá errado

| Sintoma | Causa quase sempre |
|---|---|
| O gancho não roda e não dá erro | caminho relativo. Use `"$CLAUDE_PROJECT_DIR"/.claude/hooks/...` |
| Passa o bastão na primeira resposta, em qualquer projeto | `BASTAO_LIMITE` ficou no terminal do teste. `Remove-Item Env:BASTAO_LIMITE` |
| A sessão morre mas nenhuma nasce | o terminal não foi aberto pela função `claude` do atalho: sem `BASTAO_SINAL`, não há laço |
| A sessão morre, a nova nasce, mas o navegador do agente trava | o matador precisa derrubar a **árvore** (`taskkill /F /T`), não só o processo |
| Trancou a tela e o trabalho parou mesmo assim | a **suspensão não assistida** (Parte 7). Quase sempre é ela |
| O tema/config mudou e "não aconteceu nada" | cache. Extensão de tema do VS Code só recarrega se a **versão** subir no `package.json` **e** no `extensions.json` |
| O agente diz que fez e não fez | ele afirmou sem conferir. Peça a prova: o efeito real, não o log |

---

## O que este arranjo não é

Não é um produto, não tem suporte, e não é seguro por padrão — **a segurança dele é a lista da Parte
1 e o seu julgamento.** Ele foi construído por uma pessoa, pra uma pessoa, e depois arrumado toda vez
que quebrou. Cada aviso em caixa alta neste guia existe porque alguma coisa quebrou de verdade e
custou uma tarde.

Se você instalar e algo aqui estiver errado ou faltando, o certo é corrigir **neste guia** — ele é a
fonte.
