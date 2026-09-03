---
name: cadeado-trancar-a-maquina
type: referencia
description: Como trancar a maquina dele e me deixar rodando — o vigia que segura o Modern Standby, a tampa, o que se perde com a tela trancada e o que so a senha resolve
atualizado: 2026-09-03
aliases:
  - cadeado
  - trancar
---

# Cadeado: ele tranca, eu continuo rodando

> [!warning] 03/09/2026, fim do dia: ELE TIROU O COMANDO, mas o efeito ficou
> *"pode tirar esse trancar, se o windows l não trava o seu trabalho, vou seguir com ele mesmo."*
>
> O `trancar` saiu do `profile.ps1` e o vigia foi encerrado. **O que continua de pé são os tempos
> zerados**, e é exatamente isso que faz o `Win+L` sozinho funcionar: suspender, hibernar e a
> suspensão não assistida estão em `AC=0 DC=0` (= nunca) **em caráter permanente**.
>
> **A tampa foi devolvida pra "suspender" (`AC=1 DC=1`)**, de propósito e por segurança: fechar o
> notebook volta a dormir, senão ele cozinha dentro da mochila. Isso não afeta o `Win+L`.
>
> **Os valores originais, se um dia alguém quiser voltar tudo:** suspender `AC=0 DC=1800`, hibernar
> `AC=0 DC=2147483647`, **não assistida `AC=120 DC=120`**, tampa `AC=1 DC=1`. Sem esse registro não
> haveria como desfazer, porque essas configurações são escondidas.
>
> O `.claude/scripts/cadeado.ps1` continua no repo, sem atalho apontando pra ele. Serve de
> documentação e de volta rápida, se ele quiser o cadeado de novo.


Pedido dele em 03/09/2026: *"quero que você crie algum mecanismo para eu bloquear meu computador e
você continuar rodando. Esse bloqueio deve ser desbloqueável somente por senha."*

Mora em `.claude/scripts/cadeado.ps1` (repo do assessor), com o atalho `trancar` no
`profile.ps1`, ao lado do laço do [[passagem-de-bastao]].

| Comando | O que faz |
|---|---|
| `trancar` | tranca e segura a máquina acordada **até o `-Soltar`** |
| `trancar -Armar` | só segura, sem trancar (é assim que se prova) |
| `trancar -Soltar` | desarma e devolve os quatro valores exatos que estavam lá |
| `trancar -Estado` | diz o que está armado e o que está segurando |
| `trancar -TetoHoras 8` | igual, mas solta sozinho em 8 horas |

## O ponto que quase ninguém acerta: travar a tela nunca foi o problema

`Win+L` **não mata processo nenhum** — eu continuo rodando com a máquina trancada. O risco desta
máquina é outro, e é o que justifica o script existir:

1. **É notebook com Modern Standby** (`powercfg /a` diz "Espera (S0 Ocioso com Baixo Consumo)").
   Depois de ocioso o Windows desce pro estado de baixa energia e estrangula o que roda em segundo
   plano. O vigia segura `SetThreadExecutionState(ES_CONTINUOUS | ES_SYSTEM_REQUIRED)` e isso não
   deixa descer. **Prova:** a chamada devolveu `2147483648`; zero seria falha.
2. **Fechar a tampa manda dormir, e power request nenhum segura isso** — é ação do usuário, não
   ociosidade. Por isso o script prende a tampa em "não fazer nada" e devolve no `-Soltar`.
3. `ES_DISPLAY_REQUIRED` fica **de fora de propósito**: numa máquina trancada a tela deve apagar.
4. **O culpado de verdade numa máquina TRANCADA é a "suspensão não assistida", e ela estava em
   120 segundos** nos dois modos. É a régua que manda depois do cadeado, é configuração escondida e
   não aparece em canto nenhum da interface do Windows. Sem zerar essa, o resto não adianta: dois
   minutos depois de trancar a máquina dormiria do mesmo jeito.

O script zera as **quatro** e guarda os valores de antes. Nesta máquina eram: suspender
`AC=0 DC=1800`, hibernar `AC=0 DC=2147483647`, **não assistida `AC=120 DC=120`**, tampa `AC=1 DC=1`.

O vigia nasce pelo **WMI** (`Win32_Process.Create`), a mesma lição do matador da passagem de bastão:
filho destacado morre junto com quem o disparou, filho do WMI não.

**Por padrão ele não solta sozinho** — fica de pé até o `-Soltar`, que foi o que ele pediu
(*"quero que quando eu bloquear ele, o sistema continue rodando pra sempre"*). O preço, que ele
conhece: na bateria a máquina vai até acabar. `-TetoHoras N` põe rede de segurança pra quem quiser.

## A armadilha que custou uma rodada: essas configurações são ESCONDIDAS

`Attributes = 1` no catálogo, então a ação da tampa (e a suspensão não assistida) **não aparece no `powercfg /query`** e, enquanto
ninguém mexer, **não existe chave de override no registro**. O `powercfg -setacvalueindex` grava
mesmo assim — mas **apagar a chave depois exige administrador** (`Remove-Item` responde "Acesso ao
Registro não é permitido").

Ou seja: quem lê só o override lê nada, escreve por cima e não consegue desfazer. Eu caí nisso
testando e devolvi na hora. **O conserto:** ler o padrão de fábrica em `DefaultPowerSchemeValues\<esquema>`
quando não há override, e devolver **escrevendo** o valor, nunca apagando a chave. Nesta máquina o
padrão é `AC=1 DC=1` (suspender).

## Dois limites que são dele decidir, não meus

1. **"Somente por senha" quem decide é o Windows.** A conta precisa ter senha de verdade, senão o cadeado é teatro — o script confere e recusa trancar se não houver. Mas se houver PIN ou reconhecimento facial cadastrados, eles
   também abrem. Pra ser senha e mais nada, tirar o Windows Hello em Configurações > Contas >
   Opções de entrada. O script **recusa trancar** se a conta nunca teve senha, porque aí seria
   falsa sensação de segurança.
2. **Com a tela trancada eu perco o print.** Captura de tela sai preta, então conferência de cor e
   de layout por imagem para de valer enquanto o cadeado estiver de pé — justamente a ferramenta que
   resolveu a barra da statusline. O arquivo `~\.claude\cadeado.sinal` fica cheio enquanto o cadeado
   está armado, e é por ele que eu sei disso sozinho sem tentar e falhar.

Ligações: [[passagem-de-bastao]] · [[modo-autonomo]] · [[vscode-terminal-e-atalhos]] ·
[[terminal-e-powershell]]
