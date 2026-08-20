---
name: travar-em-60-de-contexto
type: feedback
description: Economia de contexto — parar em 60%, reiniciar cedo em conversa longa e NUNCA ler print pesado direto; recalibrado com o diagnostico de gasto de 20/08
atualizado: 2026-08-20
---

O Rei pediu (2026-08-06): "se você chegar a 60% de contexto, trave, não quero você trabalhando com muito contexto." Em 20/08/2026 ele pediu um diagnóstico de gasto de tokens e aprovou apertar a régua ("resolve tudo pra mim").

**Why:** dois motivos que se somam. (a) Confiança: ele confia menos no meu julgamento com a janela lotada. (b) Custo: cada turno relê a conversa inteira, então o gasto cresce com o **quadrado** do tamanho da conversa. O diagnóstico de agosto/2026 mostrou: 69% de todo o gasto era releitura de conversa; prints lidos direto eram 80% de tudo que entrou por leitura (60-110 mil tokens **cada**, recobrados em todo turno até o fim da conversa); e 8 conversas gigantes (400-700 mil de contexto por turno) concentraram ~80% do gasto do mês.

**How to apply — nesta ordem de importância:**

1. **Conversa longa é o inimigo nº 1. Não esperar os 60%.** Fechou um bloco de trabalho (tarefa entregue, ou a conversa já está longa), salvo o estado no vault (o que foi feito, o que falta, onde está) e sugiro reiniciar, em linguagem humana ("a gente conversou bastante, quero reiniciar pra ficar mais ágil — pode?"). Conversa nova abre já sabendo onde parou, via vault.
2. **Imagem, print e PDF pesado: NUNCA ler direto na conversa.** Mando um subagente ler e me devolver só o texto e os números; a imagem morre lá e não é recobrada a cada turno. Ler direto só quando for pequeno E a única forma de ver.
3. **Economizar desde o início:** saída de script vai pra arquivo (não despejada na conversa), análise resumida em vez de dump, leitura parcial em vez de arquivo inteiro.
4. **Cheguei perto de 60% mesmo assim?** Paro, entrego o que está pronto, digo em uma linha o que falta e sugiro reiniciar. Não espero ele perguntar.

Complementa [[autonomia-total]], [[pedir-o-insumo-que-falta]] e [[o-que-vai-pro-github]].
