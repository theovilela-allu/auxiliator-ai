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

### ESTADO em 05/09/2026, fim da manha. Ele saiu e mandou seguir sozinho.

Frente unica: o site que substitui os slides. Nada travado, nada pela metade.
Leia, nesta ordem: `memory/60-visual/modelo-3d-como-eu-faco.md` (o metodo
inteiro, escrito hoje a pedido dele) e `memory/60-visual/site-de-apresentacoes.md`
(onde o projeto esta).

**O aparelho 3D fechou.** Ele mandou duas fotos do produto real e disse "quero
assim"; o acabamento foi ajustado ate bater. E o carregamento foi assado: o
trabalho pesado roda uma vez e vira arquivo pronto, com numero medido.

### O QUE ESTE DIA ENSINOU, e serve fora deste projeto

- **Print sem placa de video mente.** Tres rodadas seguidas eu li "a tela esta
  vazia" num print sem GPU e fui atras de defeito que nao existia. Conferir no
  navegador de verdade e a regra.
- **Classifique o defeito antes de consertar.** Duas provas de 30 segundos
  fecharam questao onde eu ja tinha gasto cinco tentativas: pintar de cor chapada
  (some = sombreado, fica = geometria) e pintar cada peca desenhada de uma cor
  diferente (mostra na hora qual esta na tela).
- **Espelho pega o pico do ambiente, fosco pega a media.** Sao dois ajustes.
- **Otimizar tambem e consertar.** Uma varredura minha que montava texto por
  triangulo travava a pagina por segundos e nao achava nada.
- **Otimizacao boa se mede.** 13,3 MB -> 2,5 MB, 1867 ms -> 449 ms, ~90 -> 26
  chamadas de desenho. Sem numero e chute.
- **Ferramenta de conferencia nao pode vazar pro uso normal.** O congelamento de
  tempo parava o deck inteiro e ele achou que tinha quebrado.

### O RITMO DELE, e o erro que eu cometi

Ele manda mensagem curta em cima de mensagem curta enquanto eu trabalho. Hoje eu
fiquei calado tempo demais encadeando ferramenta e ele cobrou: *"me responde
caceta"*. **Junte as mensagens, execute, mas responda em texto antes de sumir de
novo.** Silencio longo aqui le como travado.

### O QUE EU FIZ SOZINHO DEPOIS QUE ELE SAIU

Quatro frentes fechadas, cada uma provada olhando:

1. **O modelo foi assado.** O trabalho pesado roda uma vez e vira arquivo pronto.
2. **O deck nao depende mais de internet.** A biblioteca 3D e a fonte moravam em
   servidor de fora; agora moram no projeto. Wifi de sala de reuniao cai.
3. **A reserva agora e nossa.** A imagem que entra se o 3D falhar era foto de
   terceiro, e uma delas tinha marca d'agua de outro site. Trocada por um retrato
   do nosso proprio modelo, na mesma pose e na mesma caixa.
4. **Grafico**, que era o assunto marcado. Virou um TIPO DE CARD, com paleta de
   serie medida em validador (verde e laranja reprovam como vizinhos: e o par que
   some em daltonismo, e o azul entra no meio). Slide 10 do prototipo.

Um defeito que quase passou: o candidato `.glb` caia no ramo do `.obj` no
carregador e carregava o modelo cru achando que era o assado — o aparelho voltou
branco e em dobro. **Achado olhando o print, nao lendo o codigo.**

### O QUE DEPENDE DELE

- O tema dos outros slides, pra eu desenhar o fundo de cada um
- Creditar o autor do modelo 3D, ou trocar por um nosso, antes de mostrar pra fora
- Olhar o **slide 10** (o grafico) e dizer se o desenho serve
- Os numeros reais: os do slide 9 e do 10 sao exemplo
- **Gravar a animacao em video**: ideia dele. Nao e caso de "nao renderiza no
  Safari"; o ganho e ficar identico em qualquer maquina. Ele autorizou mexer no
  laser se a transparencia atrapalhar, mas pedindo aviso antes

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
