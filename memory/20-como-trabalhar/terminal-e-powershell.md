---
name: terminal-e-powershell
type: feedback
description: CORRIGIDO 24/07 — o Theo roda no terminal do VSCode (PowerShell 5.1), onde && NÃO funciona; e prefere que EU rode os comandos, não ele
atualizado: 2026-08-05
aliases:
  - comandos-bash-pro-theo
---

**Regra principal (24/07):** o Theo quer que EU rode os comandos (git, etc.) sozinho, não que eu entregue pra ele colar — *"se você consegue fazer os commits sozinho, faz isso sempre."* Ver [[commitar-todo-update]]. Então, na prática, quase nunca preciso passar comando pra ele.

**Se EU precisar mesmo entregar um comando pra ele colar:** o terminal dele é o **integrado do VSCode = Windows PowerShell 5.1**, NÃO é bash. Consequência CONFIRMADA em 24/07: `&&` dá erro ("O token '&&' não é um separador de instruções válido nesta versão"). Então comando pra ele:
- NADA de `&&` — usar `;` (encadeia no PowerShell) ou linhas separadas;
- caminho Windows `C:\Users\Allu\...` ou `cd` numa linha e o comando na seguinte.

**Correção da anotação antiga:** eu tinha registrado "sempre bash (/c/..., &&), nunca PowerShell". Isso estava ERRADO pro terminal que ele usa hoje (VSCode/PowerShell). O `&&` quebrou lá. Mantenho barra normal `/c/Users/...` só nos MEUS comandos (ferramenta bash daqui aceita).

**Meus próprios comandos** (ferramenta bash desta sessão, Git Bash): seguem em bash normal (`/c/...`, `&&`) — isso continua valendo pra mim.
