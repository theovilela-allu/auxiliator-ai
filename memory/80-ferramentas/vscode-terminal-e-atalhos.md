---
name: vscode-terminal-e-atalhos
type: referencia
description: Onde vivem os atalhos e as configurações do VS Code do Rei, o conserto do Ctrl+V de 11/08, e o tema próprio dele com as duas armadilhas que custaram a rodada
atualizado: 2026-09-03
---

# VS Code do Rei: atalhos e terminal

VS Code 1.132, instalação de usuário em `C:\Users\Allu\AppData\Local\Programs\Microsoft VS Code`. Perfil **Default** (existe um `builtin/agents`, mas é o da janela de sessões de agente, não a de trabalho).

| Arquivo | Para quê |
|---|---|
| `%APPDATA%\Code\User\settings.json` | configurações. Tinha só `claudeCode.preferredLocation: panel` |
| `%APPDATA%\Code\User\keybindings.json` | atalhos. **Não existia** até 11/08/2026 |

Extensões instaladas: claude-code (2.1.226 e 2.1.227, a antiga é sobra de atualização), Python/Pylance/debugpy, openai.chatgpt, tomoki1207.pdf.

## O Ctrl+V que parou de colar no terminal (11/08/2026)

Sintoma: Ctrl+V não colava **só dentro do terminal do VS Code**, inclusive quando ele conversava comigo pelo CLI ali. Em arquivo de código e fora do VS Code colava normal. Ele contornava com o botão direito.

O que eu descartei antes de mexer: nenhum `keybindings.json` existia em perfil nenhum · nenhuma extensão contribui atalho de colar (conferi o `package.json` das duas) · `settings.json` não tinha nada de terminal fora do padrão · Logitech Options+ está rodando e remapeia tecla **por aplicativo**, mas caiu como suspeito porque a tecla funcionava em todo o resto do VS Code · layout pt-BR normal.

Conclusão: o atalho **padrão** do próprio VS Code parou de resolver no contexto de terminal. Sem causa em arquivo, o conserto é declarar a regra, porque **atalho de usuário ganha do padrão** e não importa o que estava sombreando.

Conserto aplicado, dois arquivos:

1. `keybindings.json` criado: `ctrl+v` e `ctrl+shift+v` → `workbench.action.terminal.paste`, com `when: terminalFocus` (não toca no editor).
2. `settings.json`: `sendKeybindingsToShell: false`, `commandsToSkipShell` com o comando de colar, e `enableMultiLinePasteWarning: "never"` (tira o aviso de confirmação ao colar várias linhas, que atrapalha justo quem cola no CLI).

Os dois são lidos ao vivo, sem reiniciar. **Saída de emergência se um dia falhar de novo: `Shift+Insert` também cola no terminal**, é atalho padrão do VS Code.

## O ALT VIROU CTRL nos dois atalhos que o incomodavam (03/09/2026)

Ele: *"quero que o control funcione como control... pra colar coisas no terminal tenho que usar
alt v, pra pular pra linha de baixo, alt enter. Quero que nesses dois casos o alt vire o control."*

**A ideia que resolve sem inventar comando:** no terminal, `Alt+tecla` é literalmente a tecla
precedida de ESC (``). Então o atalho novo não precisa de um comando equivalente: ele manda
pro terminal **a mesma sequência que o Alt mandava**, com `workbench.action.terminal.sendSequence`.
Quem recebe (o Claude Code, ou o PSReadLine num shell puro) não distingue.

| Tecla | Manda | Vira |
|---|---|---|
| `ctrl+v` | `v` | o mesmo que Alt+V — cola texto **e** imagem |
| `ctrl+enter` | `
` | o mesmo que Alt+Enter — pula linha sem enviar |

As duas com `when: terminalFocus`, então o editor não muda. O `workbench.action.terminal.paste` do
conserto de 11/08 não sumiu: desceu pro `ctrl+shift+v`, que é a cola de texto pura pra shell comum
(e `Shift+Insert` segue valendo). VS Code lê o `keybindings.json` ao vivo, sem reiniciar.

**Por que não usar o `~\.claude\keybindings.json`:** ele existe e resolveria o pulo de linha
(`chat:newline`, padrão `ctrl+j`), mas o VS Code intercepta a tecla **antes** do Claude Code, então
a regra do lado do VS Code é a que manda. Uma fonte só, e ela pega os dois casos.

## O TEMA DELE: "Tema do Rei" (03/09/2026)

Ele pediu tema próprio: fundo de papel, laranja vibrante em tudo que é barra e linha. Vive como
**extensão local**, sem publicar nada:

| Onde | O quê |
|---|---|
| `~\.vscode\extensions\tema-do-rei\` | `package.json` + `themes/tema-do-rei-color-theme.json` (211 chaves de cor, com comentário no topo dizendo qual cor manda em quê) |
| `settings.json` do usuário | `workbench.colorTheme: "Tema do Rei"`, `terminal.integrated.minimumContrastRatio: 1`, e um bloco `workbench.colorCustomizations` **temporário** |
| `~\.claude\settings.json` | `theme` — só com `-ansi` no nome o Claude Code usa a paleta do terminal em vez da dele. **Em 03/09 voltou sozinho pra `light`**: a sessão que estava aberta reescreveu o arquivo ao morrer, então editar por fora não adianta nunca |
| `~\.claude\statusline.cjs` | as barras de contexto e limite; era arco-íris ciclando, virou laranja com a escada de aviso preservada (backup em `.antes-do-laranja`) |

A paleta saiu de um print que ele mandou, **lido pixel a pixel com PIL** em vez de no olho: papel
`#FCF3DE`, barras `#EAE3CE`, campos `#DFD7C2`, barra de atividade `#D8CFB8`. Depois ele pediu
laranja vibrante: acento `#FF6B1A`, linha `#E85D04`, forte `#C74407`.

### As DUAS armadilhas, que são o motivo desta seção existir

1. **O VS Code cacheia o tema pela VERSÃO da extensão.** Reescrever o JSON de cores e recarregar a
   janela **não muda nada**: ele serve o tema do primeiro carregamento. Tem que subir a `version` no
   `package.json` **e** na entrada dele em `extensions.json` (a extensão local aparece lá como
   `local.tema-do-rei`). Sintoma exato: *"acho que não aconteceu nada"*. Enquanto se ajusta, o
   caminho rápido é `workbench.colorCustomizations` escopado (`"[Tema do Rei]": { ... }`), que
   **aplica na hora, sem reload e sem cache**.
2. **O terminal do VS Code "corrige" contraste sozinho** (`minimumContrastRatio`, padrão 4.5) e
   escurece cor clara demais pro fundo. Num fundo marfim, laranja vibrante virava **marrom**.
   `terminal.integrated.minimumContrastRatio: 1` desliga e as cores saem como o tema manda.

### A BARRA DE PROGRESSO DA STATUSLINE (03/09/2026, e custou 6 tentativas)

Ele pediu: *"uma barra só, um contorno, e conforme ela for enchendo, ela vai ocupando espaço que
estava vazio, transparente, mas dentro do contorno. O contorno pode ser bem fininho."*

**O que ficou (ele escolheu vendo na tela):** uma barra só, sem lateral nenhuma, cheio `█` em
laranja `#FF6B1A` desde a **primeira** célula e vazio `█` em laranja lavado `#F7D3B8`. O contorno
virou o corpo claro da barra, e o cheio toma esse espaço conforme sobe.

**O contorno fechado que ele pediu NÃO EXISTE numa linha de terminal, e isso é limite, não preguiça:**
a linha de baixo só dá pra fazer com sublinhado (SGR 4), que o terminal desenha **abaixo** da célula;
a de cima só dá pra fazer com glifo (`▔`), que nasce **dentro** dela. As duas nunca alcançam a altura
do bloco cheio, e sai um quadrado solto numa caixa torta — foi exatamente o que ele viu e reprovou.
Overline (SGR 53), que resolveria, **o Claude Code não desenha**.

| Tentativa | Por que morreu |
|---|---|
| `▰▱` | largura ambígua, desalinha quando a fonte muda |
| `━─` | ele chamou de "um fio" |
| `█░` | vira **duas** barras coladas, não uma |
| moldura por `ESC[53m` (overline) | o Claude Code não desenha overline: barra sem linha em cima |
| laterais `▏` e `▕` | desenham o traço na borda da célula e deixam os outros **7/8 vazios**: o cheio nascia uma célula depois da borda, e o traço ficava mais alto que a moldura |
| `═` no lugar do vazio | vira dois fios colados no **meio** da célula, não um contorno |
| `▔` em cima + sublinhado embaixo | as três alturas (topo do glifo, base do sublinhado, altura do bloco) não se encontram. **"Ficou péssimo"** |

**A ferramenta que resolveu, e não pode se perder:** parar de descrever e **trocar a statusline por um
desfile de candidatos numerados**, tirar print da tela inteira com `System.Drawing.CopyFromScreen`,
achar a faixa da barra pela linha com a maior corrida contígua de laranja, recortar e ampliar só ela.
Ele olhou os cinco e disse "gostei da 5" em uma linha. Julgar no olho, sem print, custou três rodadas
antes disso.

**Glifo bonito que a fonte não tem é ruído, não enfeite.** O `⟳` que precedia o horário de reset
saiu em 03/09: a Consolas não desenha esse caractere e ele aparecia colado no horário parecendo um
`0` (*"tem algum símbolo antes do horário"*). Antes de pôr símbolo na barra, conferir se a Consolas
tem — ela é a fonte do editor, e a extensão segue `--vscode-editor-font-family`.

**A régua que fica:** em coisa de aparência, desenho não se descreve, se mostra. Duas rodadas erradas
já pagam o desfile.

> [!danger] Nesta rodada eu zerei o tema e o `settings.json` dele. Leia [[copiar-antes-e-ler-antes-de-escrever]]
> A recuperação veio do cache do próprio VS Code (`state.vscdb`, chave `colorThemeData`), que
> guarda as 211 cores e as 16 regras do tema ativo. Está tudo escrito lá.

### O TEMA VIROU AZUL (03/09/2026, fim da tarde) e o mapa dos slots ANSI

Ele trocou o `/theme` pro **"Light mode (ANSI colors only)"** e aí eu passei a mandar nas cores do
CLI. Na sequência ele pediu *"muda tudo pra azul bebê, tudo que tá laranja"*. Tema na **1.6.0**.

**Azul bebê puro em texto sobre papel some**, então o laranja não virou uma cor só: virou a mesma
escada, em azul.

Ele deu o tom a mão (`#78AEE4`) e depois afinou: *"coloca o azul do prompt mais claro, e o resto
mais escuro"*. Onde parou, no tema **1.8.0**:

Ele afinou o tom várias vezes olhando a tela e parou em **dois**, dados por ele a mão. Tema **2.4.0**:

| Papel | Cor |
|---|---|
| acento, letra do CLI, linha, forte, apagado | **`#4D85E9`** |
| faixa dos prompts dele e borda da caixa (`terminal.ansiWhite`) | **`#E5EBEE`** |
| **seleção de texto** (editor, terminal, listas, menus) | **`#A4CFE4`**, alfa 80% na principal |
| papel, barras, campos, texto, bordas pretas | sem mudança |

Barra da statusline: cheio `#4D85E9`, vazio `#E5EBEE`.

**A escada de aviso da barra fica QUENTE de propósito** (500k e 800k): azul não grita.

**O mapa que custou medição, e vale guardar:**

- **`terminal.ansiWhite` pinta DUAS coisas ao mesmo tempo**: a faixa dos prompts já enviados **e** a
  borda da caixa onde ele digita. São o mesmo slot, então não dá pra ter uma azul e a outra laranja
  — ele notou sozinho (*"isso mudou a cor que fica em volta de onde eu mando o prompt junto"*).
  É a razão de a faixa e a borda andarem sempre juntas, e de a faixa não poder ser clara demais: clara demais, a borda some como linha sobre o papel.
- **A faixa é desenhada com a letra ESCURA** (`#2D2D2A`), não clara. Medido linha a linha. É o que
  libera usar um azul claro na faixa sem perder leitura.
- **O azul que ele chamou de "o que tava antes" era `#0052AC`**, a cor que a paleta interna do
  Claude Code usava no tema `light`. Peguei do print anterior à troca, em vez de escolher um azul.

**A seleção precisou de decisão, não de substituição.** Ele pediu *"muda a cor de sublinhar para um
azul bebê também"*. As chaves de seleção estavam todas no azul escuro com alfa baixa (`3d`, `26`,
`1f`) — alfa calibrada pra cor forte. Trocar só o tom deixaria a seleção **invisível** sobre o papel
creme. Então: cor `#A4CFE4` **e alfas subidas** (`cc` na seleção principal, `80`/`66` nos ecos), mais
letra escura por cima (`list.activeSelectionForeground`). Usei `#A4CFE4` e não `#E5EBEE` porque este
último, sobre creme, é quase o próprio fundo — as duas são baby blue dele, mas só uma dá contraste.

**As cores de link e de resultado de busca ficaram no azul escuro de propósito:** elas são semântica
diferente de seleção, e igualar as duas apaga a diferença.

### A BORDA CINZA DO PROMPT: provado no pixel em 03/09/2026

A caixa onde ele digita tem borda `#999999`, e **isso não vem do tema do VS Code**: vem da paleta
interna do Claude Code. Com `theme: "light"` ou `"dark"` ele ignora o terminal inteiro.

**Provado, não deduzido:** gravei `light-ansi` no `~\.claude\settings.json` com a sessão aberta,
tirei print e amostrei. As quatro bordas continuaram `(153,153,153)`, as mesmas corridas de 875 px.
**A sessão viva não relê o tema do arquivo.** E ela grava o valor dela de volta ao morrer, que é por
que o arquivo tinha voltado pra `light` sozinho: a sessão anterior editou, achou que resolveu, e a
sessão aberta desfez.

**O único caminho: `/theme` → "Light mode (ANSI colors only)", digitado por ele na sessão viva.** Só
aí o Claude Code passa a desenhar com os 16 slots ANSI do terminal e as cores do tema valem.

**E o slot ainda NÃO está descoberto.** A sessão de 03/09 chutou `terminal.ansiBrightBlack` e o chute
caiu junto com outros dois daquele dia. Quando ele trocar, descobrir por print e PIL, não por
tentativa.

### Régua pra próxima vez

Cor que o Claude Code desenha (borda do prompt, texto apagado) **não é do tema do VS Code**: ela sai
do tema DELE. Com `light`/`dark` ele usa a paleta própria e ignora o editor; só com `-ansi` ele
respeita os 16 slots ANSI do terminal. **E editar o `theme` no arquivo não vale pra sessão que já
está aberta** — quem aplica na hora é o `/theme`, que também grava e vale pra sempre.

Ligações: [[terminal-e-powershell]], [[rotinas-agendadas-do-pc]].
