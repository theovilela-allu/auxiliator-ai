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

> [!success] Dia longo e produtivo, 03/09/2026. Abriu em [[modo-autonomo]] (*"bom dia AUTONOMO"*),
> ele apareceu por volta das 9h e ficou. **Nada ficou meio feito:** tudo commitado, empurrado e no ar.

**Estávamos fazendo:** a decisão do contrato (a tarefa vencida de 01/09) — decidida com o Rodrigo,
construída e provada no ar no mesmo dia. Antes dela, a [[caixa-de-observacao]].

**Ficou pronto, em ordem:**
1. **A caixa de observação**, front inteiro, NO AR. O primeiro clique de verdade achou **dois
   defeitos**, um deles já em produção (o gatilho barrava a escrita que cria a observação, em pedido
   que nasce aprovado). Consertos nas migrações `20260903120000` e `20260903130000`, e nasceu a
   prova que faltava (`prova-observacao-do-pedido.mjs`, 31 OK).
2. **O contrato barrando o pagamento**, decidido por ele com o Rodrigo e construído inteiro:
   migração `20260903140000`, front (Controle + a seção nova do Jurídico) e três colunas no
   fechamento. `prova-contrato-barra-pagamento.mjs` com 39 OK. Racional e o "como ficou" em
   [[onde-o-contrato-barra-o-pagamento]]. **A tarefa do Auxiliator foi concluída.**
3. **As 2 tarefas do Thoreos foram APAGADAS** a pedido dele ([[thoreos-em-espera]]): zero bloqueada.

**Onde está:** compras na worktree `C:\Users\Allu\dev\compras-allu-virada`, e **`master` e
`virada-de-setembro` os dois em `bce712d`**, empurrados. Repo do assessor em `c0db959` (as notas de
projeto e o `MEMORY.md` são gitignored de propósito: ficam só na máquina dele). Produção do banco em
**`20260903140000`**.

**Falta (em ordem):**
1. **A aprovação abrir a demanda de contrato sozinha.** É a peça que fecha o ovo e a galinha: hoje a
   trava produz pedido aprovado esperando contrato que ninguém pediu. O formulário já coleta os dados
   (`complementoContrato`); aprovou pedido que exige contrato → nasce o contrato em
   `aguardando_juridico`. Sugestão de desenho: **gatilho em `pedidos`** na virada pra `aprovado`,
   porque pedido abaixo do piso nasce aprovado direto do núcleo e um só lugar cobre os dois caminhos.
2. **Conferir por qual das três portas o Rodrigo entra em `aux_is_juridico()`** (CC 103130, quem
   responde pelo 103130 no catálogo, ou papel avulso na tabela `papeis`) antes de avisar que a tela
   está pronta pra ele. **Essa é a pergunta que ficou pendente na tela quando a conversa acabou.**
3. **A validação do de-para de conta contábil** (tarefa vencida, prioridade alta): o de-para está no
   ar desde 15/07, e falta testar com fornecedores ambíguos. Dá pra fazer sozinho, lendo a base de
   produção e listando fornecedor cujo nome cai em mais de uma conta ou em nenhuma.
4. **O piloto de lançamentos reais com uma área** (a outra vencida): depende de gente, não de código.
5. **Virar nota `DEC` no cofre FP&A** a decisão do contrato: decisão é conhecimento da equipe
   ([[onde-salvar-nota-de-trabalho]]), e ela só existe no cofre do assessor.

**Próximo passo concreto:** o item 1. Nova migração `20260903150000`, gatilho `after update on
pedidos` (e o caminho do nascimento) que chama a criação do contrato quando
`aux_exige_contrato(...)` e `contrato_id is null`. Reaproveitar `aux_criar_contrato(null, pedido_id,
complemento, null)` em vez de escrever insert novo. Prova nova no mesmo desenho da
`prova-contrato-barra-pagamento.mjs`.

**Depende do Rei:**
- Por qual porta o Rodrigo entra no Jurídico (item 2 acima) — só ele sabe.
- **A tela de Aprovações nunca foi clicada no ar:** pedido acima do piso cai na fila do Gustavo e o
  robô avisa ele. Ele pediu pra NÃO fazer ainda (03/09).
- **A planilha da base do DP**, que destrava a frente 2 e a escada da frente 5. Estava prometida pra
  03/09 e ele disse que ainda não tem.
- As 14 contas de custo de operação, o recado pro time sobre a virada, os valores da alçada, e a
  limpeza dos segredos.

**ESPERANDO O WIFI (não a 3g: ele testou e não presta):** `supabase db push` e
`migration list --linked`, só pra CONFERIR. As portas 5432/6543 estão fechadas na rede dele, então as
**três** migrações de 03/09 foram aplicadas pela API de gerenciamento (HTTPS) e as linhas de
`schema_migrations` inseridas a mão. Produção está correta e conferida no corpo vivo das funções; o
CLI é cinto de segurança, não conserto. Receita em [[ler-o-banco-em-producao]].

**Ferramentas desta sessão que não podem se perder** (as duas em [[ler-o-banco-em-producao]]): rodar
SQL em produção pela **API de gerenciamento** quando as portas do banco fecham (lembrando que por
esse caminho a linha de `schema_migrations` vai a mão), e **subir o Chrome por conta própria com
`--remote-debugging-port=9222`** quando o serviço do Playwright perde a janela de conexão na
abertura. A segunda salvou a sessão inteira: sem ela, nada de clique no ar.

**Faxina que sobrou:** um script meu perdeu as barras invertidas de um caminho do Windows num
heredoc, e o Chrome criou um perfil DENTRO do repo do assessor
(`UsersAlluAppDataLocalms-playwright-mcpmcp-chrome-3c24d0c/`, 38 MB, com a sessão Google dele).
**Nunca foi commitado** (o `Cookies` travado fez o `git add` falhar) e está no `.gitignore`. Mover
pra fora quando ele fechar a janela do navegador — que **segue aberta**, com sessão viva no Sistema
de Pagamentos e no Auxiliator, e com o Chrome escutando na 9222.

**A LIÇÃO do dia, que vale além destas frentes** ([[testar-antes-de-dizer-pronto]]): migração que
passa não é feature que funciona. Ontem eu registrei a caixa de observação como "banco pronto e
provado"; dois defeitos estavam lá, e o que os achou foi UM clique. Prova de migração cobre a
migração subir, não o caminho da pessoa.

**Auxiliator:** panorama de 03/09, versão v0.2.20 (igual à anunciada, nada a contar). Sobraram **2
vencidas**, as duas de 21/08 e as duas de FP&A: piloto de lançamentos reais e de-para conta contábil.
Nada pra hoje, ninguém esperando ele, zero bloqueada. Granola não conectado nesta sessão.

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
