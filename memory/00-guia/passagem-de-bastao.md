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

### CHAT NOVO ABERTO POR ELE em 04/09/2026, ~16h. Nao foi contexto cheio: ele pediu pra resetar.

Ele estava presente e satisfeito quando encerrou. **Nao ha frente pela metade e nao ha nada travado.**
Se ele nao puxar assunto, a abertura e o briefing normal do dia.

> [!important] PRIMEIRO PASSO
> Leia as notas locais nesta ordem: `memory/30-compras/bateria-de-fechamento-03-09.md` (o resultado
> consolidado, ja com as correcoes do dia 04), `diario-do-review-de-fechamento.md` (a narrativa hora
> a hora dos dias 03 e 04) e `bateria-apple-front.md` (a frente de arte).

### O QUE O DIA 04 FOI, em cinco linhas

Comecou com ele perguntando como tinha sido a noite anterior e terminou em frente de arte. Cinco
coisas foram pro ar, todas conferidas **pelo conteudo do pacote servido, nunca pelo nome do
arquivo**, e producao conferida **no banco, nunca no log**:

1. A pergunta *"o sistema ta no ar com as mudancas?"* virou auditoria. Estava, e provei com sonda e
   controle positivo em vez de responder pela nota.
2. Duas pecas de configuracao que faltavam em producao foram recriadas. **A licao virou regra:**
   [[recriar-na-versao-atual]].
3. **A bateria da noite anterior tinha quebrado uma funcionalidade inteira, em silencio, e so o
   CLIQUE achou.** Licao em [[fail-closed-em-dado-que-vem-depois]] — e ela e das mais valiosas do mes.
4. A frente de arte do cabecalho: menos fosco, sem sombra de projecao, e ele autorizou descolar do
   topo. Aprovou olhando.
5. Depois de ele sair (modo autonomo, ~17 minutos), a navegacao no telefone passou a avisar que ha
   mais opcao, e uma ponta solta da frente de arte foi fechada.

### O QUE FICOU ESPERANDO A PALAVRA DELE

Nada disso e falta de permissao; e decisao dele, e eu **nao devo tocar sem ele pedir**.

- **Duas branches de arte**, as duas provadas e nenhuma integrada: uma pra aprovar, outra que eu
  **implementei, medi e recomendo descartar** — e a medicao esta na nota, com o motivo fisico.
- **Dois arquivos de prova meus** ficaram num armazenamento de producao, num registro de teste ja
  cancelado. Perguntei se podia tirar, ele nao respondeu. **Eu nao apago arquivo**
  ([[o-que-eu-nao-posso-fazer]], item 1).
- **Uma branch de dependencias** fora da principal, que eu seguraria ate depois da apresentacao dele.
- **Tres decisoes de produto**, nomeadas na nota local.
- **Um slide de teste** com dois jeitos de fazer vidro em apresentacao, oferecido e ainda nao pedido.

> [!warning] O painel de indicadores dele esta FORA DO AR DE PROPOSITO
> O login trava depois do Google porque o projeto de backend nao existe mais — conferido pelo DNS
> publico e com controle positivo ao lado. Vale tambem pro app publicado. **NAO REATIVAR:** decisao
> dele, *"ele ta com prazo de duracao pra pode sair do ar"*. Detalhe em [[dashboard-big-numbers]].
> Se uma sessao futura abrir aquilo e achar que quebrou: nao quebrou.

### O QUE ESTE DIA DEIXOU DE DURAVEL, e vale mais que as entregas

- [[fail-closed-em-dado-que-vem-depois]] — fechar uma guarda que le dado que OUTRO servico escreve
  DEPOIS derruba 100% do caminho legitimo, e **nenhuma prova de bancada pega**, porque a bancada
  planta o dado ja pronto. Quem pegou foi o clique.
- [[recriar-na-versao-atual]] — recriar objeto perdido pelo recorte da versao ORIGINAL reverte tudo
  que veio depois.
- [[liquid-glass-como-fazer]] — a receita medida do vidro, reaproveitavel fora deste projeto.
- E a que atravessa as tres: **implementar, medir e DESCARTAR e entrega, nao desperdicio.** Duas
  vezes no mesmo dia a medicao derrubou uma coisa que parecia obviamente certa.

### O CHAO, pra quem retomar

Ramo principal limpo, com tudo do dia dentro. Nenhuma isca de teste sobreviveu alem dos dois arquivos
citados acima. Servidores locais de previa e o painel dele estao de pe **so enquanto esta maquina e
esta sessao viverem** — nao conte com eles amanha, e regere se precisar.

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
