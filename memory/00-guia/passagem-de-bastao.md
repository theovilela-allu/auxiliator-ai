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

> [!warning] Sessão de 03/09/2026, tarde e noite. Ele entrou e saiu várias vezes; terminou pedindo modo autônomo e desligamento.
> **O maior pacote de front do projeto FOI PRO AR às ~20h25**, e a publicação foi confirmada pelo
> conteúdo do pacote que a Vercel serve, não pelo nome do arquivo. `master` em **`4077d3d`**.
> Detalhe inteiro, com os números e as lições, em [[bateria-apple-front]].

**O que ele pediu, em seis mensagens que foram alargando o escopo:** começou com um subagente com a
persona de quem fez o Liquid Glass na Apple, virou *"que o time se inspire no frontend da Apple"*,
depois *"no frontend e no customer experience da apple **para o site todo**"*, depois mandou um vídeo
da referência pra equipe **estudar e replicar**, e no fim pediu o espelho também na quina de cima e
os menus mais legíveis.

**Onze frentes rodaram.** O resumo em uma linha cada, e os números estão na nota:
o cabeçalho de vidro com a dobra nas duas quinas · o sistema visual do site inteiro (106 tamanhos de
letra escritos à mão viraram 8, 33 cores soltas viraram 2) · o texto e o fluxo (o botão Aprovar diz
quanto está aprovando, os erros do banco viraram português de gente) · estado e acessibilidade (as
telas pararam de dizer "não tem nada" enquanto carregavam, os cliques duplos morreram, Enter funciona
no formulário) · e duas frentes de medição do vídeo dele. **1432 testes verdes.**

**A descoberta técnica que mais vale, e que resolveu o pedido dele de leitura:** o material da Apple
não clareia o fundo, ele **achata** — `dentro = 0,55 × fora + 103`, medido com 70.760 pixels pareados
dos dois lados do vidro. Isso comprime a faixa inteira de 0-255 pra 103-243, e é por isso que o texto
das barras deles nunca briga com o que passa atrás. Implantar isso levou o contraste do menu de
**3,07 para 6,50**, e custou **1%** na dobra.

**O que ele decidiu e fecha assunto:**
- **O espelho fica**, mesmo depois de eu levar a ele que na nossa barra sai reflexo reconhecível e
  **não** texto legível de cabeça pra baixo (é aritmética: comprimir 2× numa barra de 64,67px deixa a
  faixa com 10px, e letra de 14px vira 6,6px contra 5px de desfoque; a barra deles tem 178px).
- **Nas duas quinas**, não só embaixo.
- **Leitura na frente da fidelidade**, depois de reclamar duas vezes que o menu estava difícil.
- **Uma escolha minha que reportei:** a frente foi até o piso exato da régua de contraste (4,50) e
  avisou que ali é piso, não folga, porque a métrica é a mediana. **Voltei um degrau, pra 4,84.**

**O PRÓXIMO PASSO CONCRETO, e é onde a sessão parou:**

> [!important] Rodando quando a passagem disparou: **verificação em produção, logado, no navegador.**
> É a primeira vez que alguém abre **Fiscal, Aprovações, Controle e Cartões com dado de verdade** —
> toda a verificação do dia foi em máquina local **sem banco**, e essas quatro telas têm porteiro de
> perfil. O portão de qualidade anterior mediu elas numa página de sonda: geometria certa, realidade
> desconhecida. A frente tem ordem expressa de **não clicar em nada que grave, aprove, pague ou
> dispare e-mail**, e de trazer o relato do caminho do demo.
> **ELA TERMINOU e o veredito foi: o que está no ar está de pé, nada de layout precisa de conserto.** O que ela achou virou uma SEGUNDA subida (`b0c3908`, 1468 testes): o atalho da natureza, o alinhamento de um cabeçalho de dinheiro e o `vercel.json` que tirou o 404 do link fundo. **A fila acabou.** O que sobrou está em Depende do Rei, e o achado mais sério do dia está em [[bateria-apple-front]]: uma pergunta do formulário que não pode ser feita (`fornecedorPF` sem setter), com teste verde cobrindo código morto.

**Depende do Rei, e eu segurei de propósito:**
- **Ensaiar os dois cliques do demo.** Aprovar e pagar **nunca aconteceram em produção, por ninguém**,
  e vão acontecer pela primeira vez na frente da plateia. Ofereci ensaiar com uma segunda pessoa duas
  vezes hoje e nas duas ele mudou de assunto. **É o maior risco do dia da apresentação.**
- **Renomear as abas** (`Controle` → `Pagamentos`, `Lançar pedido` → `Meus pedidos`,
  `Fiscal` → `Notas fiscais`), com ordem nova por frequência de uso. É reversível, mas muda o roteiro
  do demo e muda como a empresa fala.
- **As três perguntas contábeis seguidas** no formulário (produto/serviço, pontual/recorrente,
  antecipado/depois). Quem só quer pagar uma licença atravessa as três. Dá pra deduzir parte, mas
  mexe em regra de negócio.
- O furo de segregação de função (papel de teste que ficou no banco em 25/08) e os 8 casos do de-para
  de conta contábil, os dois em [[validacao-do-depara-de-conta]].

**Coisas operacionais que ficaram na máquina:**
- **Meia dúzia de servidores de desenvolvimento velhos** nas portas 5173-5178, 5199 e 5210, sobra das
  frentes do dia. Ele se confundiu com isso (*"eu tava no local host errado"*). **Fechar.**
- Uma cópia congelada do sistema em `scratchpad/vitrine`, servida na porta 5220 pra ele olhar.
- Copiei `.env` e `.env.local` pra worktree `estado-acesso` pra o local ter banco.
- **Worktrees novas do dia:** `vidro-material`, `topo-layout`, `topo-compat`, `cx-texto`,
  `sistema-visual`, `estado-acesso`, `apple-integra`, `acabamento`, `teste-merge`.
  A linha de integração foi `estado-acesso`.

**Duas armadilhas que eu paguei pra aprender hoje e que valem pra qualquer bateria:**
1. **Worktree é de uma frente só, e o navegador também.** Pus duas no mesmo lugar e elas se
   atrapalharam: uma tomou o navegador da outra no meio de uma medição.
2. **Pra ele olhar, serve `dist` congelado num servidor estático**, nunca o `vite` da worktree em
   edição. Apontei ele pra bancada e ele ficou vendo cada estado intermediário, inclusive um erro de
   compilação que ele descreveu como *"um monte de linha de código"*.

**E uma que já estava escrita e se confirmou:** [[nao-julgar-sub-vivo-pelo-arquivo-de-saida]] — três
subs morreram de uma vez por limite de sessão da plataforma, e um deles tinha **367 linhas em 8
arquivos** esperando no worktree, sem commit, com build limpo. A última frase da devolutiva dele
("Now B2") disse com precisão onde ele parou.


> [!important] NA MESMA NOITE, EM PARALELO, outra sessão minha mexeu no BANCO
> Esta passagem conta a bateria do FRONT. **Não foi a única coisa que aconteceu em 03/09.** Uma
> segunda sessão (`auxiliator-ai-3f`) rodou uma bateria de **autorização no banco** ao mesmo tempo:
> **22 defeitos confirmados, 5 migrações no ar, mais de 20 funções mexidas em produção e o acesso de
> 8 funções revogado.** O `master` em `7459da8` tem **as duas coisas integradas** — ela puxou o meu
> `b0c3908` pra dentro antes de subir, e eu conferi que está contido.
>
> **O pior defeito dela:** qualquer funcionário conseguia marcar contrato alheio como assinado, o que
> **destrava o pagamento**. Metade dos achados é uma classe só, e ela documentou em
> [[guarda-que-falha-aberta]]: **guarda que compara com coluna anulável falha ABERTA**, porque o `if`
> não entra quando a condição vira nulo. **Leitura obrigatória antes de mexer em função de banco.**
>
> **O que eu passei pra ela, e vale pra qualquer um que for conferir aquelas revogações:** as quatro
> telas com porteiro de perfil estão **vazias em produção**, então **um 403 de revogação renderiza
> idêntico a "não tem dado"**. Julgar pelo visual passa a bateria inteira achando que está tudo bem.
> O caminho certo é **sondar as 8 funções direto pela sessão dele via PostgREST** (determinístico, não
> depende de existir dado) e só depois navegar julgando pela **rede**, caçando `403` em `/rpc/` e
> `PGRST` no corpo. A régua de como falar com o banco está em [[ler-o-banco-em-producao]].
>
> **A luz:** eu me marquei como pronto no `desligar.ps1` às 21h04 e ele não desligou porque ela está
> de pé. Ela ainda tinha essa passada e o Codex (que volta 00:10). **Quem apaga é ela.**

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
