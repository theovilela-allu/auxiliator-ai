---
name: previa-fiel-reset-de-fonte
type: feedback
description: Prévia/mock de tela do compras precisa copiar o reset de fonte do site (button/input font-family:inherit) senão engana a revisão
atualizado: 2026-08-05
aliases:
  - previa-fiel-fonte
---

Ao montar uma prévia standalone (HTML avulso) pra mostrar uma mudança visual do compras-allu, o mock TEM que replicar os resets globais do `index.css` do site, em especial `button, input, select, textarea { font-family: inherit }`. Sem essa regra, botões e inputs caem no Arial do navegador (não herdam a fonte do body), e a prévia mostra a fonte errada mesmo com o resto certo. Em 27/07 o Theo pegou na hora: "a letra do botão tá estranha, não tá na fonte da Allu". Era bug do meu mock, não do produto.

**Por que:** navegador não passa font-family pra dentro de controles de formulário; o site conserta com o reset, o mock avulso não tem isso de graça.

**Como aplicar:** ao renderizar prévia de tela do compras, ou renderizo o app real (mais fiel), ou copio os resets globais do `index.css` pro mock. E confiro a fonte computada de botões/inputs (`getComputedStyle`) antes de mandar o print. Liga com [[verificar-layout-dos-slides]].
