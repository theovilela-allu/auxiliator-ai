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
> Leia, nesta ordem, **as tres notas locais**: `memory/30-compras/bateria-de-fechamento-03-09.md`
> (o resultado consolidado, e a que ele le as 13h15), `review-de-fechamento-andamento.md` (o que
> **nao** refazer) e `diario-do-review-de-fechamento.md` (a noite hora a hora). O briefing
> operacional esta em `briefing-review-de-fechamento.md`.
>
> **So restou UMA frente**, e ela esta na secao "O que falta" aqui embaixo.

### O QUE ACONTECEU — a virada de 03 pra 04/09/2026

Ele saiu as 20h20 pedindo um code review de fechamento antes de uma revisao externa. A primeira
sessao auditou a superficie de autorizacao inteira e consertou o que achou. **Aos 500k a corrente
passou o bastao as 21h57, e a sessao que nasceu dela fez a segunda metade da noite** — a verificacao,
que e onde apareceu o que nenhuma leitura tinha como achar.

**Saldo da noite, sem detalhe:** 22 defeitos de autorizacao confirmados e corrigidos, cinco migracoes
no ar, e depois **a passada de verificacao no sistema no ar, que nao achou defeito novo**. Fora isso,
tres achados que so aparecem quando se **roda** em vez de ler, e que estao no cofre local.

**O que a segunda sessao entregou** (detalhe so nas notas locais):

1. **A passada no sistema no ar, fechada sem defeito novo.** Feita por sonda e pela rede, nunca pelo
   visual — a outra sessao tinha avisado que tela vazia por falta de dado renderiza igual a erro de
   permissao. Inclui a checagem **inversa**, que ninguem tinha feito: em vez de "o que foi revogado
   tem chamador?", perguntar "tudo que o site chama continua aberto?".
2. **A bancada de provas estava morta e ninguem tinha percebido.** A cadeia de migracoes nao subia
   mais **do zero**, e com ela as 43 provas de banco. Consertada; hoje sao **44 provas verdes**.
3. **Um pedaco da configuracao de producao nao existe**, embora o repositorio o crie e as migracoes
   constem como aplicadas. Isso quebra uma tela inteira e um botao, hoje, em silencio. **Nao
   consertei:** nao da pra saber de fora se foi apagado de proposito, e recriar coisa em producao na
   vespera de uma apresentacao nao e decisao de turno de madrugada. O reparo esta escrito, idempotente
   e **nao aplicado**.
4. **Duas mudancas da bateria sao decisao de produto, nao de seguranca**, e uma delas **reverteu uma
   escolha declarada** que estava escrita num comentario de teste. Estao nomeadas na nota local.
5. Fora do escopo original, porque nao dependiam dele: as vulnerabilidades de dependencia fecharam, e
   o **resumo de seguranca de uma pagina** que o revisor externo vai receber foi escrito.

**Tudo em branch, nada no ar.** O `master` daquele projeto continua onde a primeira sessao o deixou:
**tres** branches esperando merge, uma linha de comando cada. O motivo esta escrito no cofre — publicar
dispara deploy, e e vespera de apresentacao dele.

### A BATERIA ENCERROU as 00h24, e nao falta nada dela

A ultima frente rodou e fechou. A ferramenta externa **estourou a cota pela segunda vez na mesma
noite, sem entregar relatorio** — e a licao virou regra em [[codex-nesta-maquina]]: aquele limite nao
aguenta varredura de repositorio, o alvo tem que ser um arquivo e uma pergunta. **Nao foi comprado
credito.**

Mesmo assim a frente rendeu, e o metodo vale: **quando ela morrer no meio, leia a ultima coisa que
ela escreveu antes do erro.** Era uma hipotese boa, e confirmar custou tres minutos — deu o ultimo
achado da noite, que esta na nota local.

O caderno da bateria esta carimbado como concluido (**e esse carimbo que faz o reinicio das 5h
desligar em vez de acordar mais gente**), o diario esta fechado, e a producao esta como ele deixou:
conferi contagem por contagem no fim, e nenhuma isca das provas sobreviveu.

### AS LICOES, que sao o que vale publicar

> [!tip] Lista de migracao batendo NAO quer dizer que o repositorio descreve a producao
> A lista compara **versao aplicada**, nunca **consequencia**. Uma migracao pode ter rodado, ter o
> efeito desfeito depois por fora, e continuar verde na lista pra sempre. A noite inteira a gente
> repetiu "o repositorio voltou a descrever a producao" com base nessa lista, e estava errado.
> **Conferir estado, nao versao.**

> [!tip] Guarda de autorizacao pode falhar ABERTA, e passa em revisao
> Em linguagem com tres valores (nulo), `if not (<condicao>) then recusa` **nao entra no ramo** quando
> a condicao vira nulo — entao a guarda que devia barrar deixa passar, e continua parecendo certa na
> leitura. A forma invertida falha fechada. **Metade dos 22 achados era essa classe**, e ela passou
> por quatro auditorias porque elas procuravam crivo **ausente**, e aqui o crivo existe: so aponta pro
> lado errado.

**Familia pela metade e a assinatura do defeito.** De quatro funcoes irmas, uma ja estava consertada
com comentario explicando o buraco, e as outras tres nao. **Isso se repetiu tres vezes na mesma
noite**, em coisas diferentes. Achou um defeito? Procure os irmaos dele no mesmo minuto.

**Teste que falha depois de um conserto de seguranca nem sempre e regressao: as vezes ele estava
descrevendo o buraco.** Cinco provas falharam, e uma delas tinha **32 assercoes** rotuladas como
"legitimo" descrevendo exatamente o comportamento inseguro que a bateria fechou. Virar expectativa no
atacado pra ficar verde e o jeito mais rapido de transformar teste de seguranca em enfeite: **caso a
caso, e onde a mudanca tem custo, o custo fica escrito no comentario.**

**Medicao negativa so vale com o controle nulo do proprio teste.** Duas vezes na noite a primeira
medicao deu "tudo negado" — e nas duas era a **sonda** que estava quebrada, nao o sistema que estava
seguro. Sem um caso que TEM que passar rodando ao lado, "nao achei nada" e indistinguivel de "nao
consegui procurar".

**A hora vem do relogio, nunca da cabeca.** Escrevi seis linhas de diario com hora estimada e errei
em mais de uma hora, porque media o tempo pela quantidade de trabalho feito. Diario com hora
inventada e pior que diario sem hora: parece medicao. Virou regra: [[a-hora-vem-do-relogio]].

**Ferramenta de bancada envelhece junto com o produto.** Um ajudante de data copiado em vinte
arquivos usava UTC, entao toda prova que amarra data quebrava sozinha depois das 21h e voltava a
passar de manha. Ninguem tinha percebido porque ninguem roda a bancada de madrugada.

### A CORRENTE FUNCIONOU, e a sessao nova conferiu de dentro

A passagem das 21h57 nasceu limpa: mesmo terminal, mesma flag, mensagem de abertura no lugar, sinal
esvaziado, arvore antiga morta inteira (o navegador do Playwright incluido, que era justamente o
recurso disputado). A sessao nova pegou o navegador livre e o site ja logado no primeiro minuto.

**O que fez as duas sessoes convivirem** (e vale como regra): canal pelo cofre, cada uma na sua
worktree, **uma so integra**, e pedir o recurso compartilhado em vez de matar o processo da outra.

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
