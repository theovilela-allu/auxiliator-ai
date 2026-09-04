---
name: passagem-de-bastao
type: painel
description: LEIA PRIMEIRO em sessao nova — a secao Estado diz o que a sessao anterior estava fazendo e onde parou; a secao Como funciona explica a corrente de 500k
atualizado: 2026-09-04
status: em-andamento
aliases:
  - bastao
  - retomar-daqui
---

## Estado (reescrito a cada passagem)

> [!danger] ESTE ARQUIVO SOBE PRO GITHUB PUBLICO. O DETALHE FICA NO COFRE LOCAL.
> `memory/00-guia/**` e versionado, e o repo do assessor e **publico**. Entao aqui vai **o jeito de
> trabalhar e o ponto de retomada**; nome de funcao, caminho de exploracao, numero de negocio e
> detalhe de sistema da empresa **ficam nas notas locais** (`memory/30-compras/`, que o `.gitignore`
> cobre). Regra: [[o-que-vai-pro-github]]. Passagens antigas vazaram detalhe demais; nao repita.

> [!important] PRIMEIRO PASSO DA PROXIMA SESSAO
> Leia as notas locais, nesta ordem: `memory/30-compras/bateria-de-fechamento-03-09.md` (o resultado
> consolidado, ja com as correcoes de 04/09), `diario-do-review-de-fechamento.md` (a narrativa hora a
> hora, incluindo o dia 04) e `bateria-apple-front.md` (o vidro).

### ONDE ESTAMOS — 04/09/2026, tarde. Ele saiu as 15h28 e me pos em MODO AUTONOMO.

O dia foi todo no projeto do estagio, e ele acompanhou ate sair. Quatro frentes fechadas e no ar,
nessa ordem:

1. **A pergunta dele que virou auditoria: "o sistema ta no ar com as mudancas?"** Nao respondi pela
   nota, fui ao banco. As correcoes da noite anterior estao vivas, conferidas por sonda com controle
   positivo junto.
2. **Duas pecas de configuracao que faltavam em producao foram recriadas**, com uma correcao
   deliberada de tipo que o recorte original nao tinha. **E a licao virou regra:**
   [[recriar-na-versao-atual]] — recriar objeto perdido pelo recorte da migracao ORIGINAL reverte
   tudo que veio depois. Quem pegou foi a bancada de provas, dez minutos depois de ela voltar pro
   `master`: caiu de 114/0 pra 99/15.
3. **A bateria da noite anterior tinha quebrado uma funcionalidade inteira em producao, em silencio**,
   e so o CLIQUE achou. Detalhe e licao em [[fail-closed-em-dado-que-vem-depois]]: fechar uma guarda
   que le dado que OUTRO servico escreve DEPOIS derruba 100% do caminho legitimo, e nenhuma prova de
   bancada pega, porque a bancada planta o dado ja pronto. Consertado, provado clicando, no ar.
4. **O vidro do cabecalho** (frente de arte dele): estava fosco demais. Medi de onde vinha o fosco,
   cortei, e a leitura MELHOROU no caminho — quem segurava o texto nunca foi o branco pintado.
   O cabecalho virou ilha flutuante com cantos redondos, autorizado por ele. Numeros em
   `bateria-apple-front.md`. Ele aprovou olhando: *"ficou doido demais"*.

### A FRENTE QUE ELE PEDIU AO SAIR, e ela ja esta FECHADA e no ar

*"quando a pessoa estiver no mobile, o sistema mostre que tem mais opcoes no cabecalho."*

Medi antes de mexer: num telefone de 390px, **mais da metade da navegacao estava escondida**, e o
unico aviso era a palavra da ponta cortada, que le como bug de layout. Tres coisas mudaram: o aviso
**deixou de pintar e passou a mascarar** (pintar tinta opaca por cima morreu junto com o cabecalho de
vidro), passou a valer **dos dois lados** (quem rolava nao tinha aviso do que ficou pra tras), e
ganhou **uma seta tocavel no telefone**, que tambem leva. Provado rolando de verdade e conferido em
producao pelo CONTEUDO do pacote servido.

### A FILA DO MODO AUTONOMO ACABOU. O que fiz sozinho, das 15h28 as 15h45

Tres frentes, duas no ar e uma na estante. Detalhe nas notas locais.

1. **A frente que ele pediu ao sair, FECHADA e no ar.** Medi antes de mexer e o numero justificava o
   pedido: **mais da metade da navegacao estava invisivel** no telefone, e o unico aviso era a
   palavra da ponta cortada, que le como bug de layout. Tres mudancas: o aviso **deixou de pintar e
   passou a mascarar** (pintar tinta opaca por cima morreu junto com o cabecalho de vidro), passou a
   valer **dos dois lados**, e ganhou uma **seta tocavel** que tambem leva. Provado rolando de
   verdade e conferido em producao pelo CONTEUDO do pacote servido.
2. **A ponta solta da rodada do vidro, FECHADA e no ar.** Um texto secundario tinha sumido: ele vivia
   apoiado no veu branco que a gente tirou. O conserto certo nao era devolver o veu (isso desfaria a
   rodada inteira por causa de uma palavra), era o texto parar de depender do fundo. E declarei o
   alcance real da melhora em vez de vender o numero bonito.
3. **As duas dividas do vidro: uma resolvida na estante, a outra MEDIDA E DESCARTADA.** A que
   funciona esta em branch, esperando o olho dele — nao subi porque e mudanca de arte que ele nao
   viu, em dia de apresentacao. A outra eu implementei, medi pixel a pixel e ela **nao vale a pena**:
   custa tres vezes mais trabalho de filtro por quadro pra uma diferenca de 2 niveis em 255. O
   motivo e fisico e esta escrito na nota, junto com o caminho que eu recomendo no lugar.

> [!tip] A licao da noite, e ela e sobre metodo
> **Implementar, medir e DESCARTAR e entrega, nao desperdicio.** A dispersao esta certa como codigo e
> errada como escolha, e so a medicao pixel a pixel separou uma coisa da outra. Sem medir, isso ia
> pro ar como "ficou mais bonito" e cobraria caro em cada rolagem de telefone, pra sempre.

### PRA ELE, e nao e falta de permissao: e decisao dele

- **Duas branches de arte esperando o olho dele**, as duas provadas e nenhuma no `master`. Uma pra
  aprovar, a outra pra descartar com a medicao na mao. Ha previas servidas na maquina local pra
  comparar lado a lado, enquanto ela estiver ligada.
- **Dois arquivos de prova que eu subi ficaram no armazenamento** de um registro de teste ja
  cancelado. Eu perguntei se podia tirar e ele nao respondeu antes de sair. **Eu nao apago arquivo**
  ([[o-que-eu-nao-posso-fazer]], item 1).
- **A branch de dependencias segue fora do `master`.** E a unica que muda o que e construido, e eu
  seguraria ate depois da apresentacao.
- **Tres decisoes de produto** continuam esperando a palavra dele, nomeadas na nota local da bateria.

### ONDE O CHAO ESTA, pra quem retomar

`master` limpo, com tudo que foi pro ar hoje dentro dele e confirmado pelo conteudo do pacote
servido, nunca pelo nome do arquivo. Producao conferida no banco, nao no log. Nenhuma isca de teste
sobreviveu alem dos dois arquivos citados acima.

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
