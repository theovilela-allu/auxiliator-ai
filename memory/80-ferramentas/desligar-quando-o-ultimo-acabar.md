---
name: desligar-quando-o-ultimo-acabar
type: referencia
description: O último agente autônomo desliga o computador — como a presença é declarada, as cinco travas antes do desligamento, e a armadilha do shutdown /a
atualizado: 2026-09-03
aliases:
  - apagar-a-luz
  - auto-desligar
---

# O último agente apaga a luz

Pedido dele em 03/09/2026: *"põe alguma coisa pra o agente se auto desligar quando estiver no
autônomo e acabar o trabalho, e aí é bom que ele tenha algum modo de checar se tem mais algum agente
trabalhando, pra de modo que: o último agente, ao acabar o que ele tem pra fazer, desligue o
computador."*

Mora em `.claude/scripts/desligar.ps1`. O [[modo-autonomo]] chama nos dois pontos: `-Cheguei` no
passo 5 da abertura, `-Terminei` quando a fila esvazia, depois do commit.

| Comando | O que faz |
|---|---|
| `-Cheguei` | anuncia a sessão como agente trabalhando **e cancela desligamento pendente** |
| `-Terminei` | marca a sessão como pronta e desliga **se ela for a última** |
| `-Estado` | quem está anunciado, em que estado, e o que travaria o desligamento |
| `-Cancelar` | derruba a contagem regressiva |
| `-Terminei -Seco` | diz o que faria, sem desligar |

## Por que não dá pra olhar só os processos

**Uma sessão do Claude Code não morre quando acaba o trabalho: ela fica de pé esperando alguém
falar.** Então "existe `claude.exe` vivo" não responde "alguém ainda está trabalhando". Por isso a
presença é **declarada** num arquivo por agente em `~\.claude\agentes\<pid>.json`, e o processo serve
só pra saber se a declaração ainda vale: PID morto = anúncio velho, ignora.

O PID é o do `claude.exe` **dono** da sessão, achado subindo a árvore de processos a partir do
PowerShell que roda o script (ele é neto e morre logo; quem representa o agente é o `claude.exe`).

## As cinco travas, e todas têm que passar

1. Quem chama já se marcou como pronto.
2. Nenhum outro agente **anunciado** está trabalhando com o PID vivo.
3. **Nenhum `claude.exe` vivo sem anúncio.** Sessão não anunciada é, quase sempre, gente
   conversando — não se desliga a máquina de quem está usando. Foi essa trava que segurou o
   primeiro teste, e corretamente.
4. Teclado e mouse parados há pelo menos **15 minutos**.
5. Contagem regressiva de **120 s**, cancelável (`shutdown /a`). E qualquer sessão que nasça nesse
   meio tempo derruba a contagem sozinha, porque `-Cheguei` começa cancelando — é a rede que protege
   a sessão recém-nascida pela corrente do [[passagem-de-bastao]].

## A armadilha que quebrou o primeiro teste

`shutdown /a` **sem nada pendente escreve no canal de ERRO** ("o sistema não estava sendo desligado",
1116). Chamado direto do PowerShell, isso vira `NativeCommandError` e, com
`$ErrorActionPreference = 'Stop'`, **aborta o script inteiro**. A chamada passou a ir pelo `cmd` com
a saída engolida, e o `$LASTEXITCODE` é zerado depois: "não havia nada pra cancelar" é resultado
normal, não falha.

## O que isso pressupõe da máquina

Que ela não durma sozinha antes de o trabalho acabar — o que é o assunto de
[[cadeado-trancar-a-maquina]]. Os tempos de suspensão, hibernação e suspensão não assistida estão em
zero, e em 03/09 também entraram, com autorização de administrador dele, a proibição de **reinício
automático do Windows Update** com usuário logado (`NoAutoRebootWithLoggedOnUsers = 1`) e o
desligamento da **economia de energia da placa de Wi-Fi** — sem rede eu paro do mesmo jeito.

**O único caminho de parada que ficou de pé, de propósito:** bateria em 2% hiberna. Tirar isso
trocaria uma parada limpa por um desligamento no tapa, com perda de dado. A resposta é a tomada.

Ligações: [[modo-autonomo]] · [[cadeado-trancar-a-maquina]] · [[passagem-de-bastao]] ·
[[terminal-e-powershell]]
