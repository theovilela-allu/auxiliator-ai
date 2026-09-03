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
> Esta é a primeira passagem de verdade: o teste ao vivo que o Rei pediu em 02/09/2026 à noite. Ele abriu
> um terminal novo com `$env:BASTAO_LIMITE = 1000` e `claude`, disse "boa noite", e a sessão de origem
> passou o bastão às ~22h25 de 02/09 logo depois da primeira resposta, **com o navegador do Auxiliator
> aberto** (pra provar que o matador derruba a árvore inteira). Primeira coisa a fazer: registrar aqui
> embaixo, na seção "Como funciona", que a morte real foi provada: data, hora, se o terminal ficou limpo
> (sem lixo de tela, cursor visível) e se o navegador abriu de novo no boot sem erro de trava de perfil.
> Depois seguir a fila. **Ele está olhando**: se ele falar, o modo autônomo acaba e você responde normal.

**Estávamos fazendo:** o teste ao vivo da morte da sessão, com a corrente da passagem de bastão
construída em 02/09/2026 (`d69944b`). A sessão de origem fez o boot normal (Auxiliator logado, panorama,
versão conferida, Granola sem reunião na semana), deu o briefing e passou o bastão.

**Ficou pronto:** a corrente inteira, commitada e no GitHub (`d69944b`, `eab18bd` e o commit desta
passagem). Provado antes, num shell de mentira: o vigia dispara em 520k e cala em 300k; o laço relança
no mesmo terminal com a flag e a mensagem. Provado nesta passagem, do lado da sessão de origem: o gancho
Stop disparou na primeira resposta com a régua em 1k, devolveu a lista, e o script rodou com o
`BASTAO_SINAL` apontando pro sinal deste terminal (`bastao-36596.sinal`). **A primeira tentativa de
matar falhou** (22h25): o matador nascia como filho da minha ferramenta e morria junto com ela antes dos
2s. Consertado às 22h30 (o matador passou a nascer pelo WMI, fora da minha árvore) e a passagem foi
refeita em seguida, com o Rei olhando.

**Falta (em ordem):**
1. **Registrar a prova da morte** na seção "Como funciona" (se você existe, o `claude.exe` morreu e
   renasceu). Conferir também se o navegador abre limpo no boot: erro de trava de perfil significa que a
   árvore não morreu inteira, e isso precisa ficar anotado.
2. O trabalho do Sistema de Pagamentos que ficou de 02/09, fila em
   [[onde-retomar-depois-da-virada]], seção "O que sobrou, MEU": (a) smoke de escrita no sistema novo
   em produção (criar, aprovar e pagar um pedido baixo com "TESTE DO SISTEMA, pode ignorar", e
   cancelar no fim, nunca apagar); (b) terminar a [[caixa-de-observacao]] (front inteiro falta,
   banco pronto); (c) alinhar o master do compras com `virada-de-setembro` @ `715f617`.

**Onde está:** repo do assessor em `C:\Users\Allu\Desktop\auxiliator-ai` (master, no commit desta
passagem). Sistema de Pagamentos na worktree `C:\Users\Allu\dev\compras-allu-virada`, branch
`virada-de-setembro` @ `715f617`. **Ontem havia outra sessão minha aberta em outro terminal**: antes de
mexer no compras, releia [[combinado-entre-agentes]] e confira `git status` nas worktrees.

**Próximo passo concreto:** registrar a prova da morte aqui; depois abrir
[[onde-retomar-depois-da-virada]] e começar o smoke de escrita.

**Depende do Rei:** o recado pro time sobre a virada (rascunho a oferecer), as 14 contas de custo de
operação, a limpeza dos segredos (fica pro fim), os valores da alçada. Nada disso eu decido.

**Rascunhos prontos:** nenhum ainda.

**Auxiliator:** voltou a logar sozinho às 22h20 de 02/09 (o "Sim" do iPhone entrou). Panorama do dia,
pra não puxar de novo: 3 vencidas dele (piloto de lançamentos reais e de-para conta contábil, ambas de
21/08; decidir onde o contrato barra o pagamento, de 01/09), nada pra hoje, ninguém esperando ele, as
2 do Thoreos seguem bloqueadas de propósito. Versão v0.2.20, igual à anunciada. Nenhuma reunião na
semana no Granola.

## Como funciona (não mexer sem atualizar o código junto)

A corrente nasceu em 02/09/2026. Pedido dele: *"quando atingisse [o limite], ele salvasse tudo na
memória automaticamente e rodasse um script para encerrar o terminal, e iniciar um novo claude e
mandar a seguinte mensagem: bom dia, da uma lida pra pegar contexto."* Limite: **500 mil tokens**.

| Peça | Onde | O que faz |
|---|---|---|
| Laço do `claude` | `C:\Users\Allu\Documents\WindowsPowerShell\profile.ps1` | A função `claude` exporta `BASTAO_SINAL` (um arquivo por terminal, `~\.claude\bastao-<PID>.sinal`) e roda o `claude.exe --dangerously-skip-permissions` em laço. Morreu com sinal preenchido → limpa o console e relança **no mesmo terminal, com a mesma flag**, com a mensagem do sinal como primeiro prompt. Sinal vazio → sai normal |
| Gancho `Stop` | `.claude/hooks/bastao-de-contexto.cjs` | No fim de cada resposta minha, soma o `usage` mais recente do transcript. Acima de 500k, grava a marca `<transcript>.bastao` e devolve (código 2) a lista: consistência, reescrever a seção Estado daqui, commit/push, uma linha pro Rei, rodar o script. Uma vez por sessão; ignora `stop_hook_active` |
| Script | `.claude/hooks/passar-o-bastao.cjs` | Grava a mensagem de abertura no sinal e dispara, **pelo WMI** (`Win32_Process.Create`, que nasce fora da minha árvore; filho destacado morre junto com a ferramenta que o disparou), um matador que 2s depois derruba a **árvore inteira** do `claude.exe` (senão o navegador do Playwright fica vivo segurando a trava do perfil). `--seco` só mostra o que faria. Sem `BASTAO_SINAL` (sessão aberta pela extensão do VSCode) não mata nada e devolve a frase pra colar na mão |
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
sinal vazio. **A primeira passagem REAL** (02/09/2026 22h25, régua em 1k, terminal do VS Code) **falhou**:
o matador destacado morreu junto com a ferramenta que o disparou. Prova: um filho destacado que devia
gravar um arquivo em 4s não gravou; o mesmo filho criado pelo WMI gravou. Não tinha nada a ver com o
VS Code, a árvore estava certa (`Code.exe` → `powershell.exe` do laço → `claude.exe`). Corrigido no
mesmo minuto e refeito.

Ligações: [[travar-em-60-de-contexto]] · [[modo-autonomo]] · [[o-que-eu-nao-posso-fazer]] ·
[[terminal-e-powershell]]
