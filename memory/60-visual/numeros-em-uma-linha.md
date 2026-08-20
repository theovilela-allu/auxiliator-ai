---
name: numeros-em-uma-linha
type: feedback
description: Em slides/decks, números dentro de bolinhas/badges NUNCA empilhados na vertical — sempre na horizontal, cabendo numa linha
atualizado: 2026-08-05
aliases:
  - feedback-numeros-horizontais
---

Em apresentações (decks .pptx), quando houver número dentro de uma bolinha/círculo/badge (ex.: "01", "02" de passos numerados), o número deve **sempre caber na horizontal, numa única linha** E ficar **perfeitamente centralizado na bolinha** (horizontal e vertical). NUNCA deixar o número quebrar e empilhar na vertical (ex.: "0" em cima do "1"), nem desalinhado/torto.

**Why:** o Rei achou feio/ruim de ler quando o número quebra dentro da bolinha. Disse "NUNCA quero esses números dentro das bolinhas na vertical" e "quero eles sempre centralizados perfeitamente nas bolinhas".

**How to apply:** ao gerar badges numerados — círculo largo o suficiente pro número; fonte menor se preciso; `word_wrap = False` no text_frame pra forçar uma linha; zerar as 4 margens (`margin_left/right/top/bottom = 0`); `vertical_anchor = MIDDLE` + `alignment = CENTER`. Conferir no resultado que "01", "02" etc. aparecem deitados e bem no centro.

Relacionado: padrão visual dos decks da casa em [[python-e-pptx]].
