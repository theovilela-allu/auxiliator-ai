---
name: typeracer
type: reference
description: Corpo da skill typeracer — como eu digito no TypeRacer tecla por tecla, o mapa do site, a calibragem medida em CPM, o padrão do Rei (96% de acerto) e a única coisa que eu não faço
atualizado: 2026-08-12
---

# TypeRacer — digitar tecla por tecla

Levantado e provado no ar em 12/08/2026: duas práticas solo e quatro corridas em sala privada.

## O que o Rei declarou, e como eu ajo

Ele declarou em 12/08/2026: **as salas são privadas e do outro lado são bots ou gente que sabe que é bot.** Sobre essa declaração eu ajo direto, sem perguntar a cada rodada e sem repetir o assunto. Ele diz o número, eu largo e digito.

Fica de fora **uma** coisa: o **teste de verificação** do site, aquele que pede um mínimo de CPM sob supervisão pra provar que a velocidade é real. Aquilo é a checagem de bot da plataforma e passar por ela não está na mesa. O motor tem trava pra isso e recusa sozinho.

Se em alguma rodada ficar visível que tem humano do outro lado que **não** sabe (alguém pergunta no chat, alguém reclama), eu paro e falo com ele. Fora disso, é só operar.

## O padrão dele

| Ajuste | Valor |
|---|---|
| Unidade que ele usa | **CPM** (o site mostra CPM). `CPM = ppm × 5`, então 380 CPM = 76 ppm |
| Acerto | **96%**, sempre. Isso é `taxaErro ≈ 0.04` |
| Velocidade | ele diz o número na hora. Já pediu 600, 500, 450 e 380 CPM |

## Passo a passo

**Prática solo:** abrir `https://play.typeracer.com/?practice=1&universe=lang_pt`, clicar **Practice Yourself** (a URL sozinha cai no saguão), injetar o motor. Começa na primeira tecla.

**Sala privada:** abrir o link `...&rt=<código>`, injetar o motor com `largar: true`. Ele clica **Join Race** / **Start Race** se existirem, fica armado e dispara no instante em que a caixa liberar. Só o host tem **Start Race**; se eu não for host, quem larga é ele.

Para criar sala: **Create Racetrack** no saguão. O link de convite fica num `input` `readOnly` na seção **Invite People**.

Ajuste antes do motor: `window.__cfg = { ppm: 96, taxaErro: 0.04 }`. Acompanhar por `window.__bot` (`estado`, `i`, `total`, `erros`, `ppmMedido`, `cpmMedido`, `falha`).

## O mapa do site

| O que | Onde |
|---|---|
| Trecho, um `span` por caractere | `div.relative.leading-relaxed.select-none.overflow-hidden` |
| Caixa de digitar | `input.font-mono` |
| Progresso aceito | classe `text-success` nos spans já digitados |
| Cursor | classe `underline` marca o começo da palavra em curso |

## Mecânica que importa

- **A caixa esvazia a cada espaço.** O site cobra palavra por palavra, então toda tecla parte de `campo.value`, nunca de um texto meu.
- **Verde é a régua de retomada.** A contagem de `text-success` é exatamente quantos caracteres entraram, inclusive os da palavra em curso.
- **Erro só dentro da palavra.** Depois do espaço a palavra já foi cobrada e o backspace não volta.
- **A prática expira.** Parada tempo demais, o `input` vem `disabled`. Abrir prática nova, não insistir.
- **Sala com corrida velha** mostra "This race is no longer available" e some com os botões. Recarregar o link `rt=` conserta.
- Teclas sintéticas funcionam: `keydown` + setter nativo do `value` + evento `input` + `keyup`. Aceitação de 100% dos caracteres em todas as corridas, acento e pontuação incluídos, porque o texto sai do próprio DOM.

## Calibragem medida

`ppm` é **mira**, não resultado. Duas curvas, dependendo de ter ou não as pausas humanas:

| Modo | Regra | Medido |
|---|---|---|
| Com pausas humanas (padrão) | resultado ≈ **0,83 × mira** | mira 85 → 70 · 110 → 92 · 145 → 121 · 108 → 90 · 98 → 81 |
| Só jitter, sem pausas | resultado ≈ **0,97 × mira** | mira 512 → 486 · 854 → 833 |
| Sem pausa nenhuma (máximo) | limite da máquina | **2253 ppm**, 191 caracteres em 1s, custo de 0,48ms por tecla |

**Para acertar um pedido em CPM:** `mira = (CPM ÷ 5) ÷ 0,83`. Exemplos prontos: 380 CPM → mira 91 · 450 CPM → mira 108 · 500 CPM → mira 120 · 600 CPM → mira 145.

## O que o servidor do site recusa

- **Rápido demais não conta.** 211 caracteres em ~5s (486 ppm) voltou como **"elapsed time too short"** e a corrida não registrou. A digitação apareceu ao vivo pros outros, mas resultado gravado não houve.
- **Rápido e aceito abre verificação.** Depois de um 606 CPM válido, o site ofereceu o teste pedindo ≥455 CPM sob supervisão. Não fazemos.
- Faixa que passou limpo nos testes: **407 a 606 CPM**.

## Armadilhas do navegador

- No navegador do MCP as iframes de anúncio roubam o foco: `browser_tabs list` e `browser_evaluate` podem cair numa moldura de tracker. Se a URL voltar como `googleadservices`/`casalemedia`, navegar de novo e repetir.
- O 403 ao navegar quase sempre é anúncio quebrando, não a página. Confirmar pelo título.
- Perfil próprio de Playwright (fora do MCP) cai no Cloudflare e trava em "Um momento…". Usar a janela do MCP, que passa.
- Cada tecla é evento sintético e custa ~1ms; o freio do ritmo são as pausas, não a página.

## Ligações

[[testar-antes-de-dizer-pronto]] · [[autonomia-total]] · [[terminal-e-powershell]]
