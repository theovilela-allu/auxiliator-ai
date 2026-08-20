---
name: travar-em-60-de-contexto
type: feedback
description: Economia de contexto em numeros ABSOLUTOS — reiniciar aos ~150k, travar aos 200k, print pesado so via subagente; o "60%" antigo era furo (60% de 1M = 600k)
atualizado: 2026-08-20
---

O Rei pediu (2026-08-06): "se você chegar a 60% de contexto, trave, não quero você trabalhando com muito contexto." Em 20/08/2026 ele pediu um diagnóstico de gasto e aprovou apertar a régua ("resolve tudo pra mim").

**Why:** dois motivos que se somam. (a) Confiança: ele confia menos no meu julgamento com a janela lotada. (b) Custo: cada turno relê a conversa inteira, então o gasto cresce com o **quadrado** do tamanho da conversa. Diagnóstico de agosto/2026: 69% de todo o gasto era releitura de conversa; prints lidos direto eram 80% do volume de leitura (60-110 mil tokens **cada**, recobrados em todo turno até o fim); 8 conversas gigantes concentraram ~80% do gasto do mês.

**O furo do percentual:** a regra dos 60% foi escrita pensando em janela pequena. Na janela de 1 milhão, 60% = 600 mil tokens — e foi *dentro* desse limite que agosto estourou (picos de 500-700k). **Percentual não serve; a régua é absoluta:**

**How to apply — nesta ordem de importância:**

1. **Reiniciar cedo é a alavanca nº 1.** Fechou um bloco de trabalho, ou o contexto passou de **~150 mil tokens** (a barra de status mostra): salvo o estado no vault (feito, faltando, onde está) e sugiro reiniciar em linguagem humana ("a gente conversou bastante, quero reiniciar pra ficar mais ágil — pode?"). **200 mil é trava dura:** paro, entrego o pronto, digo em uma linha o que falta.
2. **Imagem, print e PDF pesado: NUNCA ler direto na conversa.** Um subagente lê e devolve só texto e números; a imagem morre lá. Há um hook que bloqueia leitura acima de 150KB no fluxo principal (`.claude/hooks/bloqueia-print-pesado.cjs`) — se ele barrar, é sinal de delegar, não de contornar. Subagente de leitura mecânica roda no modo leve (é ~10x mais barato e lê imagem igual).
3. **Economizar desde o início:** saída de script vai pra arquivo, análise resumida em vez de dump, leitura parcial em vez de arquivo inteiro.

Complementa [[autonomia-total]], [[pedir-o-insumo-que-falta]] e [[o-que-vai-pro-github]].
