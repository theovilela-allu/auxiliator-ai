---
name: passagem-de-bastao
type: painel
description: LEIA PRIMEIRO em sessao nova — a secao Estado diz o que a sessao anterior estava fazendo e onde parou; a secao Como funciona explica a corrente de 500k
atualizado: 2026-09-05
status: em-andamento
aliases:
  - bastao
  - retomar-daqui
---

## Estado (reescrito a cada passagem)

> [!danger] ESTE ARQUIVO SOBE PRO GITHUB PUBLICO. O DETALHE FICA NO COFRE LOCAL.
> `memory/00-guia/**` e versionado, e o repo do assessor e **publico**. Entao aqui vai **o jeito de
> trabalhar e o ponto de retomada**; nome de funcao, caminho de exploracao, numero de negocio e
> detalhe de sistema da empresa **ficam nas notas locais**, que o `.gitignore` cobre.
> Regra: [[o-que-vai-pro-github]]. Passagens antigas vazaram detalhe demais; nao repita.

### PASSAGEM POR CONTEXTO CHEIO em 05/09/2026, 13h36 (carimbo do commit `c09417f`; a
sessao anterior escreveu "16h30" de cabeca — ver [[a-hora-vem-do-relogio]]). Ele esta acordado e junto.

Frente unica o dia inteiro: **o site que substitui os slides**. Nada travado, nada
pela metade, tudo commitado e empurrado (`master`, limpo).

> [!important] PRIMEIRO PASSO
> `memory/60-visual/site-de-apresentacoes.md` (onde o projeto esta e por que cada
> coisa e como e) e `memory/60-visual/modelo-3d-como-eu-faco.md` (o metodo do 3D).
> Os dois valem mais que esta secao. Na pasta do projeto tem `LEIAME.md`.

### SESSAO AUTONOMA de 05/09, 13h37 as 13h50 (ele nao respondeu; a corrente disparou)

A fila estava vazia de proposito e eu **nao inventei frente nova**. Fiz so manutencao
do que ja existia, e ela rendeu tres achados. Nada no deck foi tocado.

1. **A hora desta passagem estava errada** (dizia 16h30, o commit e das 13h36). Corrigida
   pelo carimbo, que e a fonte. Mesmo erro de [[a-hora-vem-do-relogio]], tres dias depois:
   ele nao foi um deslize, e um habito. Hora sai do relogio ou do commit, nunca da cabeca.
2. **Tres coisas na nota local do deck nao batiam com o disco** — uma secao descrevendo um
   desenho que ja tinha sido substituido no mesmo dia, um item na lista do que falta que a
   propria nota desmente mais abaixo, e um atalho explicado de dois jeitos. Corrigidas
   lendo o codigo, nao a nota.
3. **A origem do modelo 3D nao estava anotada em lugar nenhum**, e a licenca exige creditar
   o autor. Recuperei o recibo do download antes que ele sumisse (esta na nota local do
   projeto). Falta so abrir o anuncio e ler o nome: leitura automatica e barrada la.
4. **Achei uma incoerencia no quadro do escritorio** e registrei na tarefa certa, sem mexer
   em status: uma tarefa esta fechada, mas o criterio de conclusao dela depende de outra que
   nao rodou. Nao reabri sozinho porque reabrir mexe num numero que o lider dele le — e
   decisao dele. Detalhe na descricao da tarefa.
5. **Sincronizar reuniao virou regra nova**, e essa vale pra sempre: o sistema exige o e-mail
   da propria pessoa na lista de participantes, entao sincronizar reuniao de que ela nao
   participou so passa se eu inventar a presenca dela. Nao sincronizo. Escrito em
   `granola-reunioes.md`, com o porque.
6. **Passei os olhos no deck no navegador de verdade** (nao no print sem placa, que mente):
   fonte carregando, video girando em laco, biblioteca 3D nem baixada como devia, zero
   recurso vindo de fora. So um 404 de icone, cosmetico. Print em `deck-allu\conferencia\`.

> [!important] O que ficou pra ele desta sessao, alem da lista de baixo
> **Reabrir ou nao a tarefa fechada cedo demais.** O quadro hoje da a entender que uma
> recomendacao ja foi entregue ao lider, e ela nao foi. Reabrir corrige a leitura e derruba
> o progresso da meta; deixar como esta mantem o numero e a leitura errada. Eu nao decido isso.

### ELE VOLTOU as 13h50, e o modo autonomo acabou ali

Reclamacao dele, e estava certa: *"avacalhou a animacao do fio e o liquid glass"*.
As duas coisas eram efeito colateral do conserto de desempenho da tarde. Feitas e
provadas, detalhe na nota local do projeto. Depois disso ele pediu o aparelho
parado num lugar so, e isso tambem esta feito.

> [!important] O QUE ESTE PEDACO DO DIA ENSINOU, e vale fora daqui
> - **Otimizacao que se paga em qualidade nao e conserto, e troca — e tem que ser
>   escrita como troca.** Registrei "de 22,5 ms pra 8,8" como vitoria limpa; duas
>   das quatro alavancas eram qualidade trocada por tempo, e ele viu na tela o que
>   eu nao tinha anotado. A pergunta certa nao e "quanto ganhei", e "o que isso
>   custou na tela".
> - **Numero absoluto de desempenho desta maquina nao vale nada sozinho:** a mesma
>   build deu 10,28 ms numa rodada e 17,02 na seguinte. So a comparacao alternada
>   dentro da mesma sessao vale. Citar uma rodada isolada e o erro que fez a medida
>   de ontem mentir ao contrario.
> - **Quando o obvio custa caro, ataque a causa em vez de escolher entre feio e
>   lento.** A mancha borrada nao precisava morfar geometria: virou duas copias e
>   uma troca de opacidade. Ficou lisa E com cauda melhor que a versao feia.
> - **Medida de celula de grade nao serve de ancora.** Ela muda quando a fonte
>   carrega e o texto reflui (239,6 antes, 253,2 depois). Posicao que precisa ser
>   estavel se DECLARA, nao se mede.
> - **Geometria se mede no espaco do OBJETO, nunca no do mundo**, quando o objeto
>   tem transformacao propria. Medi uma peca com o modelo girando e conclui que
>   havia desnivel entre partes que sempre estiveram no mesmo plano: rotacao em
>   torno da vertical converte um eixo no outro.
> - **Quando N coisas tem que dar o MESMO numero, o numero vira teste.** Foi ele,
>   e nao o olho, que pegou os dois erros seguidos que eu cometi nessa frente.
> - **Ancore num ponto que voce conhece, nao numa ponta de caixa.** Caixa de peca
>   curva nao diz qual ponta e qual.
> - **O que grava em tempo real herda o mau humor da maquina.** Uma captura que
>   amostra sozinha transforma um engasgo local em defeito permanente no arquivo.
>   Resultado que precisa ser deterministico se empurra quadro a quadro.
> - **Prova parcial da sensacao de prova.** O gravador provava uma coisa e nao a
>   outra, e o defeito passou por anos-luz de distancia do que ele conferia.
> - **Medida de desempenho durante o carregamento mede a rede, nao o programa.**
>   Quase sai otimizando um numero que era artefato meu.
> - **Pedido de "avisa que esta carregando" merece a pergunta QUANDO carrega.**
>   Aqui a resposta era "na pior hora possivel", e so o aviso nao consertaria.
> - **Nao entregue endereco sem ter aberto ele.** Mandei o primeiro link em
>   negrito e so depois descobri que aquele deploy servia 404 na raiz. Deploy e
>   imutavel: o endereco que nasceu quebrado fica quebrado pra sempre, e ele
>   passou meia hora tentando abrir aquele enquanto eu achava que estava tudo no
>   ar. **Um link so, o estavel, e conferido antes de sair da minha boca.**
> - **Correcao enterrada e correcao perdida.** Os enderecos certos vieram depois,
>   no meio de mensagem longa, e ele continuou no primeiro. Se o que eu mandei
>   antes esta errado, a correcao vai sozinha, curta e no comeco.
> - **Tela que cobre o produto tem que falhar ABERTO, e rapido.** Eu tinha posto
>   45s de espera maxima: uma tela preta por 45s nao le como "carregando", le
>   como quebrado. Passou pra 10s.

### ONDE ESTA

`Desktop\deck-allu`, **fora do repo do assessor** e sem git proprio. Sobe com
**`python servidor.py`** (nao o `http.server` de fabrica: o proprio proibe cache e
aceita Range, e sem essas duas coisas voce depura codigo velho e o congelamento de
conferencia falha calado). O assador (`python assador.py`) so precisa subir pra
assar ou gravar. Os dois ficaram ligados.

### O QUE FOI FEITO HOJE, em uma linha cada

1. **A animacao do aparelho virou video** com fundo transparente (WebM/VP9 guarda
   alfa; MP4 nao). O 3D virou reserva, o retrato parado e a reserva da reserva.
2. **O giro e uma volta continua de 24s** com rubato: demora nas costas, passa
   depressa pela frente e pelos perfis. Um arquivo so, laco nativo do `<video>`.
3. **O aparelho atravessa a virada girando**, nos slides 09 e 10: ele mora num
   hospedeiro em cima do trilho, e a vaga dentro do slide fica vazia.
4. **A lente da camera foi refeita pelas fotos dele**, com as medidas viradas em
   contrato (estao na nota do projeto).
5. **A apresentacao parou de travar**: virada de 22,5 ms por quadro pra 8,8, pior
   quadro de 228 pra 49, e zero tarefa longa.
6. Achados de caminho: a fonte do deck estava caida desde 04/09 (caminho duplicado
   no `.css`), o `shot.ps1` mente e agora avisa, e o passa-bastao passou a conferir
   se esta mirando a propria sessao.

### FILA

Vazia do meu lado, e continua vazia depois da sessao autonoma de 13h37 (a manutencao
que dava pra fazer sozinho esta feita, esta listada la em cima). **Nao invente
trabalho**: o que sobrou e dele, esta na secao abaixo, e a unica frente minha
congelada e o acabamento do corpo do aparelho — congelada de proposito, porque e
olho dele e ele pediu pra eu parar de afinar material no chute.

> [!important] Mexeu no acabamento do aparelho? ASSA E GRAVA DE NOVO
> `prototipo.html?assar=1&gravar=1` faz os dois numa passada, uns 40 segundos.
> Assar sem gravar deixa a apresentacao com o aparelho velho: ela toca video, nem
> olha pro modelo.

### O QUE DEPENDE DELE, e por isso eu nao toco

- O tema dos outros slides, pra eu desenhar o fundo de cada um
- Creditar o autor do modelo 3D, ou trocar por um nosso, antes de mostrar pra fora
- Olhar o **slide 10** e dizer se o desenho do grafico serve
- Os numeros reais: os do slide 9 e do 10 sao exemplo
- Editor e banco do deck: as decisoes estao fechadas, a implementacao nao comecou
- **O que a tela da frente do aparelho mostra**, agora que a volta inteira faz ela
  aparecer. Hoje e o papel de parede laranja, com brilho baixo
- **O rubato do giro** foi escolha minha, nao dele: dois numeros zeram
  (`RUBATO` e `RUBATO2` em `aparelho3d.js`)

### O QUE ESTE DIA ENSINOU, e serve fora deste projeto

- **Antes de cacar o defeito, prove que voce esta olhando pro objeto certo.** Print
  sem placa de video mente; pagina com cache roda o codigo velho; trocar so a ancora
  do endereco nem recarrega. Marca de versao no arquivo resolve em 10 segundos.
- **Tenha ferramenta de conferencia, e nao deixe ela vazar pro uso normal.** A lupa,
  a pintura de cada peca com uma cor e esconder a camada de cima acharam em trinta
  segundos o que quatro rodadas de afinar material nao acharam.
- **Confirmar que algo NAO existe exige olhar onde ele apareceria.** Declarei que o
  deck nao escalava depois de ler a escala do palco na unica janela em que ela e 1.
- **Medida de desempenho se repete com a ordem embaralhada**, senao ela mente ao
  contrario. E **desfoque cobra por pixel**: metade da resolucao e um quarto do custo.
- **Comparar print de coisa que pulsa exige congelar o pulso.**
- Em material com transmissao, **a cor base multiplica o que passa**: cor escura nao
  faz vidro escuro, faz vidro opaco.

### O RITMO DELE

Mensagem curta em cima de mensagem curta enquanto eu trabalho. **Junte, execute, mas
responda em texto antes de sumir de novo** — silencio longo aqui le como travado. E
ele pediu, com todas as letras, pra eu parar de afinar material no chute: quando algo
estiver estranho, perguntar o que especificamente, ou medir.

## Como funciona (não mexer sem atualizar o código junto)

A corrente nasceu em 02/09/2026. Pedido dele: *"quando atingisse [o limite], ele salvasse tudo na
memória automaticamente e rodasse um script para encerrar o terminal, e iniciar um novo claude e
mandar a seguinte mensagem: bom dia, da uma lida pra pegar contexto."* Limite: **500 mil tokens**.

| Peça | Onde | O que faz |
|---|---|---|
| Laço do `claude` | `C:\Users\Allu\Documents\WindowsPowerShell\profile.ps1` | A função `claude` exporta `BASTAO_SINAL` (um arquivo por terminal, `~\.claude\bastao-<PID>.sinal`) e roda o `claude.exe --dangerously-skip-permissions` em laço. Morreu com sinal preenchido → limpa o console e relança **no mesmo terminal, com a mesma flag**, com a mensagem do sinal como primeiro prompt. Sinal vazio → sai normal |
| Gancho `Stop` | `.claude/hooks/bastao-de-contexto.cjs` | No fim de cada resposta minha, soma o `usage` mais recente do transcript. Acima de 500k, grava a marca `<transcript>.bastao` e devolve (código 2) a lista: consistência, reescrever a seção Estado daqui, commit/push, uma linha pro Rei, rodar o script. Uma vez por sessão; ignora `stop_hook_active` |
| Script | `.claude/hooks/passar-o-bastao.cjs` | Grava a mensagem de abertura no sinal e dispara, **pelo WMI** (`Win32_Process.Create`, que nasce fora da minha árvore; filho destacado morre junto com a ferramenta que o disparou), um matador que 2s depois derruba a **árvore inteira** do `claude.exe` (senão o navegador do Playwright fica vivo segurando a trava do perfil). `--seco` só mostra o que faria. Confere se o alvo está mesmo debaixo do terminal dono do sinal e recusa se não estiver; anota toda tentativa em `~/.claude/bastao.log`. Sem `BASTAO_SINAL` não mata nada e devolve a frase pra colar na mão |
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

## O ALVO DA PASSAGEM, e o susto de 04/09/2026

Em 04/09, 20h, uma passagem nao matou a sessao e ficou a suspeita de que o script
**achava o `claude.exe` por NOME** e, com varias sessoes abertas, matava uma irma. Hoje
tem **tres `claude.exe` vivos** nesta maquina, entao a suspeita era razoavel. (A anotacao
daquela noite tinha sido colada no fim da nota do deck, e nao aqui; voltou pro lugar em
05/09.)

**Nao era isso.** O script ja subia a cadeia de pai a partir do PID do proprio node desde
02/09 (commit `ea4b2e6`), e conferido em 05/09 ele acerta o alvo: sobe
`node -> bash -> bash -> bash -> claude.exe`, e esse `claude.exe` e mesmo o desta sessao.
O que faltou em 04/09 foi **prova**: nao existia registro nenhum do que o script mirou,
entao a investigacao virou reconstrucao. O sinal daquela noite (`bastao-17504.sinal`)
continua cheio e o terminal dele morreu sem o laco consumir — coerente com a sessao ter
sido fechada na mao, que foi o contorno usado.

Duas coisas mudaram em 05/09 pra isso nao se repetir:

1. **Conferencia cruzada.** Duas coisas independentes dizem qual sessao e a minha: a
   cadeia de processo e o nome do arquivo de sinal (`bastao-<pid do terminal>.sinal`).
   Agora elas tem que concordar. Se o `claude.exe` encontrado nao estiver debaixo do
   terminal dono do sinal, o script **recusa** e diz por que, em vez de derrubar a irma
   em silencio. Provado nos dois lados: com o sinal certo diz `CONFERE`; com o sinal de
   outro terminal recusa, sai com erro e nao mata nada.
2. **Caderno em `~/.claude/bastao.log`.** Uma linha por tentativa: alvo, terminal, cadeia
   e desfecho. Custa nada e evita a proxima adivinhacao.

**Se mesmo assim a passagem nao acontecer:** o sinal ja fica gravado, entao basta fechar a
sessao na mao (`/exit` ou Ctrl+C duas vezes); o laco `while ($true)` da funcao `claude` no
`profile.ps1` le o sinal e relanca no mesmo terminal com a mensagem de abertura. E o
caderno agora diz o que aconteceu.
