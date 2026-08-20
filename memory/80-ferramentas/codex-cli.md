---
name: codex-cli
type: reference
description: Como conversar com o Codex (OpenAI) nesta máquina — binário, modelo e nível de raciocínio que o Theo quer
atualizado: 2026-07-14
---

Dá pra conversar com o Codex pela linha de comando (modo não-interativo):

- Binário: `c:\Users\Allu\.vscode\extensions\openai.chatgpt-26.803.61601-win32-x64\bin\windows-x86_64\codex.exe` (extensão do VS Code; não está no PATH — se a extensão atualizar, o caminho muda de versão, procurar de novo em `~\.vscode\extensions\openai.chatgpt-*`). **Atualizado em 12/08/2026**: era a versão `26.707.71524`, o que confirma que a extensão troca de pasta sozinha; sempre listar antes de chamar.
- Uso: `codex.exe exec -s read-only -C <repo> -m gpt-5.6-sol -c model_reasoning_effort="ultra" -o <arquivo-resposta> -` com a mensagem entrando **via stdin** (ex.: `$prompt | & codex.exe exec ... -`).
- **PEGADINHA (2026-07-14):** rodando em background pelo PowerShell, o stdin fica aberto e o codex TRAVA em "Reading additional input from stdin..." pra sempre se você passar o prompt como argumento. Sempre pipe o prompt pelo stdin (o pipe fecha o stdin no fim) e confira nos primeiros segundos se o log já mostra o cabeçalho "OpenAI Codex vX" + o eco do prompt.
- **Pedido do Theo (2026-07-14): sempre usar modelo `gpt-5.6-sol` com raciocínio `ultra`** (o máximo; a escada é low→medium→high→xhigh→max→ultra). O config.toml dele tem sol/xhigh como padrão, então passar os flags explícitos.
- Rodar em background (demora minutos no ultra). Resposta final sai no arquivo do `-o`.
- Sandbox read-only por padrão nas minhas chamadas; só subir pra workspace-write se o Theo pedir pro Codex editar algo.
- Continuar uma conversa: `codex.exe exec resume --last "<mensagem>"` (mantém o contexto da sessão anterior).
