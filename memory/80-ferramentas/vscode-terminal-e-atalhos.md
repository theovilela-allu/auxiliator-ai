---
name: vscode-terminal-e-atalhos
type: referencia
description: Onde vivem os atalhos e as configurações do VS Code do Rei, e o conserto do Ctrl+V que parou de colar no terminal em 11/08
atualizado: 2026-08-11
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

Ligações: [[terminal-e-powershell]], [[rotinas-agendadas-do-pc]].
