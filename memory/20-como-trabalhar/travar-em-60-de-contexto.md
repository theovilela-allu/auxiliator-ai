---
name: travar-em-60-de-contexto
type: feedback
description: Economia de contexto — desde 02/09 nao existe trava: aos 500k a sessao passa o bastao sozinha (salva o estado, morre, renasce no mesmo terminal em modo autonomo)
atualizado: 2026-09-02
aliases:
  - economia-de-contexto
---

O Rei pediu (2026-08-06): "se você chegar a 60% de contexto, trave, não quero você trabalhando com muito contexto." Em 20/08/2026 ele aprovou apertar a régua: aviso aos 150k, trava aos 200k.

**Em 02/09/2026 a trava deixou de existir.** Ele: *"travar não pode significar nada mais de prompts, eu posso querer mandar salvar na memória ou algo assim."* No lugar dela entrou a [[passagem-de-bastao]]: aos **500 mil tokens** eu salvo o estado no Obsidian, a sessão morre e renasce no mesmo terminal já em [[modo-autonomo]]. Ele começou pedindo 600k e baixou pra 500k quando eu lembrei que a faixa de 500 a 700k foi onde o gasto de agosto estourou.

**Why:** dois motivos que se somam. (a) Confiança: ele confia menos no meu julgamento com a janela lotada. (b) Custo: cada turno relê a conversa inteira, então o gasto cresce com o **quadrado** do tamanho da conversa. Diagnóstico de agosto/2026: 69% de todo o gasto era releitura de conversa; prints lidos direto eram 80% do volume de leitura (60-110 mil tokens **cada**, recobrados em todo turno até o fim); 8 conversas gigantes concentraram ~80% do gasto do mês.

**How to apply, nesta ordem de importância:**

1. **Reiniciar cedo continua sendo a alavanca nº 1, e é por minha conta.** Fechou um bloco de trabalho: salvo o estado no vault e ofereço reiniciar em linguagem humana ("a gente conversou bastante, quero reiniciar pra ficar mais ágil, pode?"). Não espero a barra ficar laranja pra oferecer. A passagem automática dos 500k é a rede, não a régua.
2. **Imagem, print e PDF pesado: NUNCA ler direto na conversa.** Um subagente lê e devolve só texto e números. Há um hook que bloqueia leitura acima de 150KB no fluxo principal (`.claude/hooks/bloqueia-print-pesado.cjs`; esse 150 é KB de arquivo, nada a ver com a régua de contexto). Barrou → delegar, não contornar. Subagente de leitura mecânica roda no modo leve.
3. **Economizar desde o início:** saída de script vai pra arquivo, análise resumida em vez de dump, leitura parcial em vez de arquivo inteiro.

Complementa [[autonomia-total]], [[pedir-o-insumo-que-falta]] e [[o-que-vai-pro-github]].
