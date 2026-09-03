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

> [!info] Sessão de 03/09/2026 que começou AUTÔNOMA à tarde e virou conversa quando ele chegou.
> Duas frentes fecharam (a demanda de contrato e o levantamento do de-para) e a terceira, o
> **tema do editor**, ficou com UM pedido especificado e não aplicado. Nada meio feito no código.

**O que fechou nesta sessão** (detalhe em [[onde-o-contrato-barra-o-pagamento]] e
[[validacao-do-depara-de-conta]], as duas no cofre local):

1. **A aprovação abre a demanda de contrato** e o robô cobra quem gera. No ar, provado em produção
   com rollback. Commit `0c46c0c`.
2. **Levantamento do de-para de conta contábil.** Não é defeito de código; a base ensina duas contas
   pro mesmo texto em 8 casos, 5 cruzando custo com despesa. **Falta a decisão dele nos 8**, com a
   minha recomendação escrita caso a caso. A tarefa vencida no Auxiliator foi registrada pela outra
   sessão, deixada em andamento e sem mexer na data, o que está certo.
3. **A nota `DEC` da decisão do contrato** foi pro cofre da equipe (commit `b0e03b1` lá).
4. **O perfil de Chrome saiu de dentro do repo** do assessor (39 MB com sessão Google dele).

**O TEMA DO EDITOR — o que ficou pendente, com a régua já extraída**

O "Tema do Rei" está no ar e ele aprovou ("assim ficou top"): fundo marfim, escada de beige, laranja
vibrante nos acentos e **bordas do VS Code em preto**, a pedido dele. Mecânica inteira, com as duas
armadilhas que custaram a rodada, em [[vscode-terminal-e-atalhos]].

**O pedido aberto**, que ele deu marcando cinco círculos num print (li da esquerda pra direita e
amostrei cada um com PIL, então não precisa adivinhar):

| Círculo | O que é | Cor hoje | Cor que ele quer |
|---|---|---|---|
| 1 | a faixa larga em volta da linha de digitar | `#EED4B7` | `#F0F0F0` (a do círculo 5) |
| 2 e 3 | as linhas da caixa do prompt | `#999999` | `#FF6B1A` (a do círculo 4) |
| 4 | a barra de status do CLI | `#FF6B1A` | (é a referência) |
| 5 | a banda atrás dos prompts dele no painel da extensão | `#F0F0F0` | (é a referência) |

**O BLOQUEIO, e é de uma linha:** os três elementos (1, 2 e 3) são desenhados pelo **Claude Code**,
não pelo VS Code. No tema `light` ele usa a paleta própria e ignora o terminal, daí o `#999999` que
não obedece nada que eu pinte. O print dele mostra literalmente *"Theme set to light"*. **Só no tema
com ANSI no nome** ("Light mode (ANSI colors only)") ele passa a desenhar com os 16 slots do
terminal, e aí eu mando na cor. Avisei duas vezes e ele seguiu no `light`; o `~/.claude/settings.json`
já está em `light-ansi`, mas **editar o arquivo não vale pra sessão aberta** — quem aplica é o `/theme`.

**Próximo passo concreto quando ele trocar:** `terminal.ansiBrightBlack` já está em `#E85D04`; subir
pra `#FF6B1A` (o do círculo 4) e descobrir qual slot pinta a faixa da linha de digitar pra levar ela
pra `#F0F0F0`. Se em ANSI a faixa simplesmente não existir, dizer isso a ele em vez de inventar.

**Onde está tudo:**
- Tema: `~/.vscode/extensions/tema-do-rei/` (versão **1.5.0** — subir a versão nos DOIS lugares,
  `package.json` e `extensions.json`, é o que quebra o cache; sem isso o VS Code serve o tema velho).
- Um bloco `workbench.colorCustomizations` **temporário** no `settings.json` dele, escopado no tema,
  que é o que faz a cor valer na hora. **Combinado: apagar esse bloco quando ele parar de mexer**,
  depois de um reload que carregue o tema 1.5.0, porque hoje são duas fontes da mesma cor.
- Compras: worktree `C:/Users/Allu/dev/compras-allu-virada`; `master` e `virada-de-setembro` os dois
  em **`1cb517c`** (a outra sessão subiu a tela de quem pede em três áreas); produção do banco em
  `20260903150000`.
- Duas fontes baixadas e **não instaladas** em `scratchpad/fontes/` (JetBrains Mono, IBM Plex Mono).
  Ele não gostou da Cascadia e voltamos pra Consolas, que é o que a extensão usa (o CSS dela segue
  `--vscode-editor-font-family`, ou seja, sempre a fonte do editor).

**Falta, em ordem:**
1. **A cor dos cinco círculos**, assim que ele trocar o tema do CLI pro ANSI (tabela acima).
2. **Os 8 casos do de-para** esperam decisão dele; quando vier, aplicar pela `aux_carregar_classificacao`,
   que aplica retroativo no par, e conferir no banco.
3. Apagar o bloco temporário do `settings.json` depois do reload.
4. O piloto de lançamentos reais com uma área: depende de gente, não de código.

**Depende do Rei:**
- Escolher no `/theme` a opção com ANSI no nome (é o que destrava os três círculos).
- Os 8 casos de conta contábil.
- Dois achados desta sessão, os dois escritos no cofre local: um papel de teste que ficou no banco e
  deixa a mesma pessoa executar e autorizar exceção. **A segunda alegação ("a faixa livre não vale
  na prática") era FALSA e foi derrubada lendo produção em 03/09 à noite** — detalhe em
  [[politica-de-aprovacao]], seção do fim.
- **ESTE REPO É PÚBLICO, e a seção Estado carrega detalhe operacional.** Eu tirei daqui nome, código
  de centro de custo e o desenho de um furo de controle, e deixei ponteiro pro cofre local. Passagens
  de dias anteriores já subiram com esse tipo de detalhe, e desfazer isso não é meu: decisão dele é
  passagem só com a mecânica, repo privado, ou reescrever o histórico.
- A tela de Aprovações nunca foi clicada no ar: ele pediu pra NÃO fazer ainda.
- A planilha da base do DP, as 14 contas de custo de operação, o recado pro time e a limpeza dos
  segredos.

**Ferramentas que não podem se perder:** as duas de [[ler-o-banco-em-producao]] (SQL em produção pela
API de gerenciamento; Chrome por CDP na 9222), a **desta sessão** (provar RPC em produção como se
fosse ele, com `set_config('request.jwt.claims', ...)` dentro de um `do` que termina em `raise`: o
relatório volta na mensagem de erro e tudo rola pra trás), e a de hoje pra cor: **amostrar print com
PIL** em vez de julgar no olho, inclusive achando os círculos vermelhos por cluster.

**A LIÇÃO da sessão** ([[testar-antes-de-dizer-pronto]]): eu afirmei três causas antes de abrir o
dado (o desenho do gatilho, a causa da divergência do de-para e o slot da borda do prompt) e as três
caíram. A régua nova está escrita lá: causa anunciada é promessa, porque a pessoa e o outro agente
agem em cima dela.

**Auxiliator:** a outra sessão conferiu no boot — logado, v0.2.20, 2 vencidas (as duas de FP&A),
nada pra hoje, nada bloqueado, zero reunião na semana.

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
