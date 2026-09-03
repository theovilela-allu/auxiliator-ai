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

> [!info] Sessão CURTA de 03/09/2026, à noite, aberta em [[modo-autonomo]] pela corrente do bastão.
> Ele apareceu depois de uns minutos com *"salva o que fizemos, vou precisar desligar"*.
> **Não construí nada** — esta sessão foi leitura e diagnóstico, e o diagnóstico derrubou o desenho
> que a passagem anterior tinha sugerido. Está tudo salvo; nada meio feito.

**Estávamos fazendo:** o item 1 da fila (a aprovação abrir a demanda de contrato sozinha). Fui ler o
código pra construir e **descobri que o desenho sugerido não funciona.**

**O que esta sessão entregou, e é conhecimento, não código:**

1. **O gatilho NÃO pode criar o contrato.** `aux_criar_contrato(null, pedido_id, complemento, null)`,
   que a passagem mandava reaproveitar, **estoura** com *"o PDF do contrato é obrigatório"* — e antes
   disso exige a vigência no complemento. O PDF é feito **no navegador** (`src/contrato/gerar.ts`), e
   a policy do cofre `contratos` só aceita upload na pasta de um pedido de **quem está logado**: quem
   gera é o **dono do pedido**, na aba Contratos, *"nunca o aprovador, que o banco recusaria"* (está
   escrito no topo de `src/contrato/automatico.ts`). Inserir linha sem PDF é possível e é PIOR:
   demanda falsa na fila do Rodrigo, e o resumo diário do robô cobrando ele por um contrato sem
   documento.
2. **O desenho que funciona**, em três partes, todo escrito em [[onde-o-contrato-barra-o-pagamento]]
   (seção nova no fim): carimbo `pedidos.contrato_demandado_em` + gatilho na virada pra `aprovado`
   (um lugar cobre os dois nascimentos); **ramo novo no robô `cobrar`** cobrando QUEM PEDIU, no rito
   de sempre (`planejarCobranca`/`marcarSeEntregue`), líder do 2º degrau em diante — essa é a parte
   que entrega a feature, sem ela o carimbo é timestamp que ninguém lê; e o conserto da frase.
3. **UM DEFEITO NO QUE SUBIU HOJE.** As duas pontas dizem *"o Jurídico emite e o fornecedor
   assina"* (banco em `aux_pedido_contrato_pendente`, front em `motivoNaoPagavel`). **Errado:** quem
   emite é quem pediu, o Jurídico dá o **parecer**. A frase manda o Financeiro esperar uma ação que o
   Rodrigo não vai fazer, e não avisa a única pessoa que pode desatravancar o pedido. Não é urgente
   (nenhum pedido real está preso hoje), mas é conserto de uma linha em cada ponta e entra junto da
   parte 3.

**Onde está:** nada de código mudou. Compras na worktree `C:\Users\Allu\dev\compras-allu-virada`, e
**`master` e `virada-de-setembro` os dois em `bce712d`** (conferido nesta sessão, bate com a passagem
anterior), produção do banco em `20260903140000`. Repo do assessor commitado com esta passagem.

**Falta (em ordem, e o item 1 agora tem desenho pronto):**
1. **A aprovação abrir a demanda de contrato.** Desenho fechado nas três partes acima — é sentar e
   escrever: migração `20260903150000`, ramo do robô, frase. **Começa por aqui.**
2. **Conferir por qual das três portas o Rodrigo entra em `aux_is_juridico()`** (CC 103130, quem
   responde pelo 103130 no catálogo, ou papel avulso em `papeis`) antes de avisar que a tela está
   pronta pra ele. Dá pra conferir lendo produção; o que só ele sabe é o que fazer se não cair em
   nenhuma.
3. **A validação do de-para de conta contábil** (tarefa vencida, prioridade alta): no ar desde 15/07,
   falta testar com fornecedores ambíguos. Dá pra fazer sozinho, lendo a base de produção e listando
   fornecedor cujo nome cai em mais de uma conta ou em nenhuma.
4. **O piloto de lançamentos reais com uma área** (a outra vencida): depende de gente, não de código.
5. **Virar nota `DEC` no cofre FP&A** a decisão do contrato ([[onde-salvar-nota-de-trabalho]]): ela só
   existe no cofre do assessor.

**Depende do Rei:**
- Por qual porta o Rodrigo entra no Jurídico, se ele não cair em nenhuma das três.
- **A tela de Aprovações nunca foi clicada no ar:** ele pediu pra NÃO fazer ainda (03/09).
- **A planilha da base do DP**, que destrava a frente 2 e a escada da frente 5. Estava prometida pra
  03/09 e ele disse que ainda não tem.
- As 14 contas de custo de operação, o recado pro time sobre a virada, os valores da alçada, e a
  limpeza dos segredos.

**ESPERANDO O WIFI (não a 3g: ele testou e não presta):** `supabase db push` e
`migration list --linked`, só pra CONFERIR. As portas 5432/6543 estão fechadas na rede dele, então as
**três** migrações de 03/09 foram aplicadas pela API de gerenciamento (HTTPS) e as linhas de
`schema_migrations` inseridas a mão. Produção está correta e conferida no corpo vivo das funções; o
CLI é cinto de segurança, não conserto. Receita em [[ler-o-banco-em-producao]].

**Ferramentas que não podem se perder** (as duas em [[ler-o-banco-em-producao]]): rodar SQL em
produção pela **API de gerenciamento** quando as portas do banco fecham (por esse caminho a linha de
`schema_migrations` vai a mão), e **subir o Chrome por conta própria com `--remote-debugging-port=9222`**
quando o serviço do Playwright perde a janela de conexão na abertura.

**Faxina que sobrou:** o Chrome criou um perfil DENTRO do repo do assessor
(`UsersAlluAppDataLocalms-playwright-mcpmcp-chrome-3c24d0c/`, 38 MB, com a sessão Google dele).
**Nunca foi commitado** e está no `.gitignore`. Mover pra fora quando ele fechar a janela do navegador.

**A LIÇÃO que se repetiu, agora do outro lado** ([[testar-antes-de-dizer-pronto]]): ontem foi migração
que passa e não é feature que funciona. Hoje foi **desenho que parece óbvio na nota e o código
recusa**. As duas têm o mesmo conserto: ler o corpo vivo antes de prometer o caminho. O que salvou
esta sessão foi ir ler `aux_criar_contrato` antes de escrever a migração 150000.

**Auxiliator:** não conectei nesta sessão (a conversa foi curta e o Rei chegou). Panorama de 03/09,
v0.2.20: 2 vencidas, as duas de FP&A (piloto de lançamentos reais e de-para conta contábil), zero
bloqueada.

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
