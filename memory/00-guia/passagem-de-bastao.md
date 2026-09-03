---
name: passagem-de-bastao
type: painel
description: LEIA PRIMEIRO em sessao nova — a secao Estado diz o que a sessao anterior estava fazendo e onde parou; a secao Como funciona explica a corrente de 500k
atualizado: 2026-09-02
status: em-andamento
aliases:
  - bastao
  - retomar-daqui
---

## Estado (reescrito a cada passagem)

> [!important] Se você está lendo isto numa sessão que abriu SOZINHA com "MODO AUTONOMO", a morte funcionou.
> Esta é a primeira passagem de verdade, o teste ao vivo que o Rei pediu pra fazer em 02/09/2026 à
> noite (*"salva que fez isso na memória pra eu testar a morte"*). Primeira coisa a fazer: registrar
> aqui embaixo, na seção "Como funciona", que a morte real foi provada (data, hora, e se o terminal
> ficou limpo: sem lixo de tela, cursor visível). Depois seguir a fila. **Ele provavelmente está
> olhando**: se ele falar, o modo autônomo acaba e você responde normal.

**Estávamos fazendo:** construindo a própria corrente da passagem de bastão e o modo autônomo, na
noite de 02/09/2026, na sessão em que o Rei estava presente.

**Ficou pronto:** tudo, commitado e no GitHub em `d69944b` (master do assessor): o laço no
`profile.ps1`, o gancho Stop `bastao-de-contexto.cjs`, o script `passar-o-bastao.cjs`, o gancho
`sem-plan-mode.cjs` (plan mode desligado), a skill `modo-autonomo`, o `modo-especialista` sem plan
mode, a lista das seis proibições ([[o-que-eu-nao-posso-fazer]]), a barra de status em 500k/800k.
Provado: o vigia dispara em 520k e cala em 300k; o laço relança num shell de mentira com a flag e a
mensagem certas.

**Falta (em ordem):**
1. **A morte de verdade** (esta passagem): claude.exe real morrendo com o navegador junto e
   renascendo no mesmo terminal. Se você existe, passou. Registre.
2. O trabalho do Sistema de Pagamentos que ficou de 02/09, fila em
   [[onde-retomar-depois-da-virada]], seção "O que sobrou, MEU": (a) smoke de escrita no sistema novo
   em produção (criar, aprovar e pagar um pedido baixo com "TESTE DO SISTEMA, pode ignorar", e
   cancelar no fim, nunca apagar); (b) terminar a [[caixa-de-observacao]] (front inteiro falta,
   banco pronto); (c) alinhar o master do compras com `virada-de-setembro` @ `715f617`.

**Onde está:** repo do assessor em `C:UsersAlluDesktopauxiliator-ai` (master `d69944b`). Sistema
de Pagamentos na worktree `C:UsersAlludevcompras-allu-virada`, branch `virada-de-setembro` @
`715f617`. **Havia outra sessão minha aberta em outro terminal nesta noite**: antes de mexer no
compras, releia [[combinado-entre-agentes]] e confira `git status` nas worktrees.

**Próximo passo concreto:** registrar a prova da morte aqui; depois abrir
[[onde-retomar-depois-da-virada]] e começar o smoke de escrita.

**Depende do Rei:** o recado pro time sobre a virada (rascunho a oferecer), as 14 contas de custo de
operação, a limpeza dos segredos (fica pro fim), os valores da alçada. Nada disso eu decido.

**Rascunhos prontos:** nenhum ainda.

**Auxiliator:** a sessão caiu às 21h27 de 02/09 e o login ficou esperando o "Sim" no app do YouTube do
iPhone dele. Se continuar deslogado, não espere: anote e trabalhe pelo Obsidian.

## Como funciona (não mexer sem atualizar o código junto)

A corrente nasceu em 02/09/2026. Pedido dele: *"quando atingisse [o limite], ele salvasse tudo na
memória automaticamente e rodasse um script para encerrar o terminal, e iniciar um novo claude e
mandar a seguinte mensagem: bom dia, da uma lida pra pegar contexto."* Limite: **500 mil tokens**.

| Peça | Onde | O que faz |
|---|---|---|
| Laço do `claude` | `C:\Users\Allu\Documents\WindowsPowerShell\profile.ps1` | A função `claude` exporta `BASTAO_SINAL` (um arquivo por terminal, `~\.claude\bastao-<PID>.sinal`) e roda o `claude.exe --dangerously-skip-permissions` em laço. Morreu com sinal preenchido → limpa o console e relança **no mesmo terminal, com a mesma flag**, com a mensagem do sinal como primeiro prompt. Sinal vazio → sai normal |
| Gancho `Stop` | `.claude/hooks/bastao-de-contexto.cjs` | No fim de cada resposta minha, soma o `usage` mais recente do transcript. Acima de 500k, grava a marca `<transcript>.bastao` e devolve (código 2) a lista: consistência, reescrever a seção Estado daqui, commit/push, uma linha pro Rei, rodar o script. Uma vez por sessão; ignora `stop_hook_active` |
| Script | `.claude/hooks/passar-o-bastao.cjs` | Grava a mensagem de abertura no sinal e dispara um matador destacado que, 2s depois, derruba a **árvore inteira** do `claude.exe` (senão o navegador do Playwright fica vivo segurando a trava do perfil). `--seco` só mostra o que faria. Sem `BASTAO_SINAL` (sessão aberta pela extensão do VSCode) não mata nada e devolve a frase pra colar na mão |
| Barra de status | `C:\Users\Allu\.claude\statusline.cjs` | Laranja aos 500k ("passagem a caminho"), vermelho aos 800k ("a passagem falhou, olha isso") |
| A sessão nova | [[modo-autonomo]] | A mensagem de abertura diz "MODO AUTONOMO": ela lê este arquivo, o `MEMORY.md` e o painel do projeto, e trabalha sozinha na fila, sem pergunta e sem trava |

A mensagem de abertura, fixa no script:

```
bom dia, da uma lida pra pegar contexto. MODO AUTONOMO: voce nao esta aqui, entao le a passagem de
bastao, entende onde a gente parou e segue trabalhando sozinho no que ficou pra fazer.
```

**Coisas que a corrente NÃO faz:** não apaga arquivo nenhum (sinal é esvaziado, marca fica), não
fecha terminal nem abre janela, não passa o bastão no meio de uma tarefa (o `Stop` só roda quando eu
terminei de responder), e não repete a passagem numa sessão em que ela já falhou (a marca impede;
por isso o vermelho da barra existe).

**Testar sem esperar 500k:** num terminal NOVO, `$env:BASTAO_LIMITE = 1000` e depois `claude`. A primeira
resposta já passa o bastão. O laço zera esse limite antes de relançar, então a sessão que nasce volta
ao 500k de sempre (senão a corrente viraria laço infinito). **Provado em 02/09/2026** num shell de
mentira: relançou no mesmo terminal, com a flag, com a mensagem; sinal esvaziado; laço fecha com
sinal vazio.

Ligações: [[travar-em-60-de-contexto]] · [[modo-autonomo]] · [[o-que-eu-nao-posso-fazer]] ·
[[terminal-e-powershell]]
