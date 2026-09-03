---
name: passagem-de-bastao
type: painel
description: LEIA PRIMEIRO em sessao nova — a secao Estado diz o que a sessao anterior estava fazendo e onde parou; a secao Como funciona explica a corrente de 500k
atualizado: 2026-09-03
status: em-andamento
aliases:
  - bastao
  - retomar-daqui
---

## Estado (reescrito a cada passagem)

> [!success] Sessão AUTÔNOMA da tarde de 03/09/2026 ("boa tarde, autonomo"). Ele não estava.
> O item 1 da fila **saiu inteiro e está no ar**, o item 2 foi respondido lendo produção, e a
> conferência que esperava wifi **foi feita**. Nada meio feito.

**O que esta sessão entregou** (commit `0c46c0c`, em `master` e `virada-de-setembro`, empurrado):

1. **A aprovação abre a demanda de contrato** — as três partes do desenho de ontem:
   carimbo `pedidos.contrato_demandado_em` + contadores, por gatilho **BEFORE** (não AFTER: o
   carimbo entra na mesma versão da linha, sem segundo `update` batendo no guard); **ramo novo no
   robô `cobrar`** cobrando quem pediu, sem teto, com régua testada em
   `_shared/demanda-de-contrato.ts`; e a **frase consertada nas duas pontas**, dizendo quem
   destrava conforme o estado do contrato. Detalhe inteiro em
   [[onde-o-contrato-barra-o-pagamento]] (última seção).
2. **Provas em produção, com rollback:** a aprovação carimbou (`16:56:38`) pelo caminho de verdade
   (`aux_criar_pedido_v3` + `aux_decidir_pedido_escada`, sessão simulada por
   `request.jwt.claims` — receita nova, vale guardar), e o nascimento aprovado carimbou
   (`16:57:43`). Nenhum pedido de mentira ficou lá. Front conferido pelo CONTEÚDO do bundle,
   função `cobrar` republicada e respondendo.
3. **O item 2 respondido:** conferi em produção por qual porta o Jurídico entra na régua de
   permissão. Entra por duas das três, sem precisar de ajuste nenhum — a tela dele já funciona.
   Qual e por quê está no cofre local, em [[onde-o-contrato-barra-o-pagamento]].

**A espera pelo wifi acabou:** as portas 5432/6543 voltaram nesta rede. `migration list --linked`
bate local com remoto em **todas as 106**, incluindo as três de ontem que entraram pela API de
gerenciamento, e a `20260903150000` subiu por `db push` normal.

**Onde está:** Compras na worktree `C:\Users\Allu\dev\compras-allu-virada`; `master` e
`virada-de-setembro` os dois em **`0c46c0c`**; produção do banco em `20260903150000`. Repo do
assessor commitado com esta passagem.

**Falta (em ordem):**
1. **Virar nota `DEC` no cofre FP&A** a decisão do contrato ([[onde-salvar-nota-de-trabalho]]): ela
   só existe no cofre do assessor. É a última coisa da frente do contrato.
2. **A validação do de-para de conta contábil** (tarefa vencida, prioridade alta): no ar desde
   15/07, falta testar com fornecedores ambíguos. Dá pra fazer sozinho, lendo a base de produção e
   listando fornecedor cujo nome cai em mais de uma conta ou em nenhuma.
3. **O piloto de lançamentos reais com uma área** (a outra vencida): depende de gente, não de código.

**Depende do Rei:**
- **A tela de Aprovações nunca foi clicada no ar:** ele pediu pra NÃO fazer ainda (03/09).
- **Dois achados desta sessão, os dois decisão dele, escritos com nome e número no cofre local**
  ([[onde-o-contrato-barra-o-pagamento]] e [[politica-de-aprovacao]]): (a) um papel de teste de
  25/08 que ficou no banco e hoje deixa a mesma pessoa executar e autorizar a exceção — furo de
  segregação de função, tirar ou manter é dele, eu deixei; (b) **a faixa livre da alçada não está
  valendo na prática**, porque a régua de estouro de orçamento escala todo pedido de centro de
  custo sem orçamento carregado, e quase nenhum tem. Ou carrega orçamento, ou a faixa livre segue
  decorativa.
- **ESTE REPO É PÚBLICO, e a seção Estado carrega detalhe operacional da Allu.** Eu tirei daqui
  hoje o que era nome, código de centro de custo e o desenho de um furo de controle, e deixei
  ponteiro pro cofre local (que é `.gitignore`ada de propósito). Mas passagens dos dias anteriores
  já subiram com esse tipo de detalhe, e isso não é meu pra desfazer: **decisão dele** é se a
  passagem passa a ser só a mecânica (com o estado num arquivo local), se o repo vira privado, ou
  se reescreve o histórico. Enquanto ele não disser, eu escrevo aqui como se fosse público.
- **A planilha da base do DP**, que destrava a frente 2 e a escada da frente 5. Estava prometida
  pra 03/09 e ele disse que ainda não tem.
- As 14 contas de custo de operação, o recado pro time sobre a virada, os valores da alçada, e a
  limpeza dos segredos.

**Faxina que sobrou:** o perfil do Chrome que nasceu DENTRO do repo do assessor
(`UsersAlluAppDataLocalms-playwright-mcpmcp-chrome-3c24d0c/`, 38 MB, com a sessão Google dele).
**Nunca foi commitado** e está no `.gitignore`. Esta sessão não abriu navegador; mover pra fora
quando nenhuma janela estiver segurando a trava.

**Ferramentas que não podem se perder:** as duas de [[ler-o-banco-em-producao]] (SQL em produção
pela API de gerenciamento; Chrome por CDP na porta 9222) e a **nova desta sessão**: provar RPC em
produção **como se fosse ele**, com `set_config('request.jwt.claims', ...)` dentro de um `do` que
termina em `raise` — o relatório volta na mensagem de erro e **tudo rola pra trás**, então dá pra
testar o caminho de verdade sem deixar pedido de teste no banco.

**A LIÇÃO desta sessão** ([[testar-antes-de-dizer-pronto]]): ontem o desenho óbvio na nota foi
recusado pelo código; hoje a prova em produção mostrou que **o caminho que o desenho supunha
comum (pedido que nasce aprovado) não acontece hoje** — e só apareceu porque o teste rodou pelo
caminho de verdade, não por um insert de mentira. Ler o corpo vivo é metade; a outra é rodar o
fluxo inteiro uma vez.

**Auxiliator:** não conectei nesta sessão (fila de código cheia e nenhum pedido dele). Panorama de
03/09, v0.2.20: 2 vencidas, as duas de FP&A (piloto de lançamentos reais e de-para conta
contábil), zero bloqueada.

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
ao 500k de sempre (senão a corrente viraria laço infinito).

> [!warning] A régua de teste fica no TERMINAL, não no projeto, e pega qualquer pasta
> `BASTAO_LIMITE` é variável de ambiente do terminal e **só é zerada quando uma passagem acontece
> naquele terminal**. Em 02/09 ele abriu outro projeto no mesmo terminal do teste e a sessão passou o
> bastão na primeira resposta, o que pareceu bug e não era. Conserto: `Remove-Item Env:BASTAO_LIMITE`,
> ou abrir terminal novo. **E os ganchos precisam de caminho absoluto** (`node "$CLAUDE_PROJECT_DIR"/.claude/hooks/...`):
> com caminho relativo eles não rodam quando o Claude abre de outra pasta. **Provado em 02/09/2026** num shell de
mentira: relançou no mesmo terminal, com a flag, com a mensagem; sinal esvaziado; laço fecha com
sinal vazio. **A primeira passagem REAL** (02/09/2026 22h25, régua em 1k, terminal do VS Code) **falhou**:
o matador destacado morreu junto com a ferramenta que o disparou. Prova: um filho destacado que devia
gravar um arquivo em 4s não gravou; o mesmo filho criado pelo WMI gravou. Não tinha nada a ver com o
VS Code, a árvore estava certa (`Code.exe` → `powershell.exe` do laço → `claude.exe`). Corrigido no
mesmo minuto e refeito.

**A morte real foi PROVADA em 02/09/2026 às 22h29** (segunda tentativa, com o matador pelo WMI). Quem
escreve isto é a sessão que nasceu dela. O que a sessão nova conferiu de dentro, na abertura:

- **Renasceu no mesmo terminal**: `powershell.exe` 36596 (o do VS Code, aberto às 22h19) é o pai do
  `claude.exe` novo (89756, nascido às 22h29m35, 17 segundos depois do último commit da origem), com
  `--dangerously-skip-permissions` e a mensagem de abertura como primeiro prompt. O sinal
  `bastao-36596.sinal` estava esvaziado pelo laço, a marca `.bastao` da origem ficou.
- **A árvore morreu inteira, navegador incluído**: o Auxiliator da origem usava o perfil
  `mcp-chrome-3c24d0c` (gravado até 22h22). Não sobrou processo nenhum dele, e o boot da sessão nova
  abriu **o mesmo perfil** às 22h32 sem erro de trava e já logado. A outra sessão minha, no terminal
  das 21h06 (`claude.exe` 49532, perfil `28c730e`), ficou intacta, como devia.
- **O terminal ficou limpo.** Isso não dá pra conferir de dentro; ele confirmou às 23h30 de
  02/09/2026 (*"sim"*, à pergunta se o terminal ficou limpo depois da morte).

Ligações: [[travar-em-60-de-contexto]] · [[modo-autonomo]] · [[o-que-eu-nao-posso-fazer]] ·
[[terminal-e-powershell]]
