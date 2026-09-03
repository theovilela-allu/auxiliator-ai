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

## O TEMA DELE: "Tema do Rei" (03/09/2026)

Ele pediu tema próprio: fundo de papel, laranja vibrante em tudo que é barra e linha. Vive como
**extensão local**, sem publicar nada:

| Onde | O quê |
|---|---|
| `~\.vscode\extensions\tema-do-rei\` | `package.json` + `themes/tema-do-rei-color-theme.json` (211 chaves de cor, com comentário no topo dizendo qual cor manda em quê) |
| `settings.json` do usuário | `workbench.colorTheme: "Tema do Rei"`, `terminal.integrated.minimumContrastRatio: 1`, e um bloco `workbench.colorCustomizations` **temporário** |
| `~\.claude\settings.json` | `theme: "light-ansi"` — é o que faz o Claude Code usar a paleta do terminal em vez da dele |
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

### Régua pra próxima vez

Cor que o Claude Code desenha (borda do prompt, texto apagado) **não é do tema do VS Code**: ela sai
do tema DELE. Com `light`/`dark` ele usa a paleta própria e ignora o editor; só com `-ansi` ele
respeita os 16 slots ANSI do terminal. **E editar o `theme` no arquivo não vale pra sessão que já
está aberta** — quem aplica na hora é o `/theme`, que também grava e vale pra sempre.

Ligações: [[terminal-e-powershell]], [[rotinas-agendadas-do-pc]].
