---
name: travar-em-60-de-contexto
type: feedback
description: Economia de contexto em numeros ABSOLUTOS — desde 02/09 a barra so avisa aos 600k e trava aos 800k; o cuidado de reiniciar cedo continua valendo por conta propria
atualizado: 2026-09-02
---

O Rei pediu (2026-08-06): "se você chegar a 60% de contexto, trave, não quero você trabalhando com muito contexto." Em 20/08/2026 ele pediu um diagnóstico de gasto e aprovou apertar a régua ("resolve tudo pra mim"): o aviso passou a sair aos 150k e a trava aos 200k.

**Mudança de 02/09/2026 — a régua da BARRA subiu, a pedido dele:** *"preciso que você tire um aviso que ta aparecendo de mais de 150k de tokens de contexto. Quero que esse aviso apareça somente quando atingir mais de 600k."* Feito em `C:\Users\Allu\.claude\statusline.cjs`: laranja aos **600k**, vermelho aos **800k** (mantive a mesma proporção 3/4 da régua velha, agora escalada pra janela de 1 milhão). Eu apontei o risco na hora e ele decidiu assim mesmo.

**Why:** dois motivos que se somam. (a) Confiança: ele confia menos no meu julgamento com a janela lotada. (b) Custo: cada turno relê a conversa inteira, então o gasto cresce com o **quadrado** do tamanho da conversa. Diagnóstico de agosto/2026: 69% de todo o gasto era releitura de conversa; prints lidos direto eram 80% do volume de leitura (60-110 mil tokens **cada**, recobrados em todo turno até o fim); 8 conversas gigantes concentraram ~80% do gasto do mês. **Foi na faixa dos 500-700k que agosto estourou** — ou seja, quando a barra ficar laranja agora, o gasto já está no patamar caro. Por isso o item 1 abaixo continua sendo meu trabalho, não da barra.

**How to apply — nesta ordem de importância:**

1. **Reiniciar cedo continua sendo a alavanca nº 1, e agora é por minha conta.** Fechou um bloco de trabalho: salvo o estado no vault (feito, faltando, onde está) e sugiro reiniciar em linguagem humana ("a gente conversou bastante, quero reiniciar pra ficar mais ágil — pode?"). Não espero a barra mudar de cor pra oferecer isso. **800 mil é trava dura:** paro, entrego o pronto, digo em uma linha o que falta.
2. **Imagem, print e PDF pesado: NUNCA ler direto na conversa.** Um subagente lê e devolve só texto e números; a imagem morre lá. Há um hook que bloqueia leitura acima de 150KB no fluxo principal (`.claude/hooks/bloqueia-print-pesado.cjs`, e esse 150 é KB de arquivo, não tem nada a ver com a régua de contexto) — se ele barrar, é sinal de delegar, não de contornar. Subagente de leitura mecânica roda no modo leve (é ~10x mais barato e lê imagem igual).
3. **Economizar desde o início:** saída de script vai pra arquivo, análise resumida em vez de dump, leitura parcial em vez de arquivo inteiro.

Complementa [[autonomia-total]], [[pedir-o-insumo-que-falta]] e [[o-que-vai-pro-github]].
