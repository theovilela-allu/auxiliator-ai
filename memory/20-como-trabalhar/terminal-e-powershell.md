---
name: terminal-e-powershell
type: feedback
description: O Theo roda os comandos no terminal integrado do VSCode (PowerShell 5.1), onde && não funciona — então todo comando que eu entrego já sai nesse formato
atualizado: 2026-08-31
aliases:
  - comandos-bash-pro-theo
---

**Confirmado de novo em 31/08/2026**, com as palavras dele: *"eu sempre vou rodar os códigos no terminal do próprio vscode, então é pra já me dar os comandos nesse formato."* Não é preferência ocasional, é o padrão.

## O formato

Terminal integrado do VSCode = **Windows PowerShell 5.1**, não é bash. Todo comando que eu entrego pra ele colar segue isto:

- **Nada de `&&`.** Dá erro de parser ("O token '&&' não é um separador de instruções válido nesta versão"). Usar `;` ou linhas separadas.
- **Caminho no formato Windows,** com barra invertida: `Waiter\waiter-app`, não `/c/Users/...`.
- **Caminho relativo à pasta que ele tem aberta no VSCode.** O terminal já nasce na raiz do workspace, então `cd Waiter\waiter-app` basta, não precisa do caminho absoluto. Confirmado em 31/08, quando ele apontou: *"mas aqui nós estamos na pasta theo, não waiter."*
- `cd` numa linha, o comando na seguinte.

## Quem roda o quê

Regra de 24/07 que continua valendo: quando eu consigo rodar sozinho, eu rodo, não fico entregando comando pra ele colar. Ver [[commitar-todo-update]] e [[autonomia-total]].

O comando vai pra ele quando eu **não consigo** executar: credencial que não pode passar por mim, trava de permissão que barrou ([[comando-barrado-para-e-pergunta]]), ou algo que exige a conta pessoal dele. Aí sai no formato acima, sem ele ter que traduzir nada.

**Meus próprios comandos** (a ferramenta bash da sessão, que é Git Bash) seguem em bash normal, com `/c/...` e `&&`. Isso é outro ambiente, não confundir com o dele.

## `npx` não roda no terminal dele: use `npx.cmd`

Descoberto em 31/08/2026. O PowerShell dele está com execução de script desabilitada, então
`npx` resolve pro shim `C:\Program Files\nodejs\npx.ps1` e morre com
`PSSecurityException / UnauthorizedAccess` antes de rodar qualquer coisa. Mesma história valeria
pra `npm.ps1`.

**Todo comando que eu entregar pra ele sai com `npx.cmd`** (e `npm.cmd`, se for o caso): o shim
`.cmd` não passa pela política de execução. Nunca `npx` puro, nunca `& npx`.

E o **diretório importa duas vezes**: o CLI do Supabase lê a fonte da função a partir da pasta
atual, então `cd` pra pasta do projeto certo vem antes, em linha separada. Em 31/08 ele colou o
deploy estando na pasta do assessor: mesmo sem a trava do `.ps1`, não teria função nenhuma pra subir.
