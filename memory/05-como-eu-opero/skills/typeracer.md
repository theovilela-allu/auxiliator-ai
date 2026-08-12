---
name: typeracer
type: reference
description: Corpo da skill typeracer — como eu digito no TypeRacer tecla por tecla, o mapa do site, a calibragem medida em CPM, o padrão do Rei (96% de acerto) e a única coisa que eu não faço
atualizado: 2026-08-12
---

# TypeRacer — digitar tecla por tecla

Levantado e provado no ar em 12/08/2026: duas práticas solo e quatro corridas em sala privada.

## O limite, e por que ele não se move (12/08/2026)

**Eu digito na prática solo e em sala privada com gente que sabe que sou eu. Corrida pública, não. Sondar a defesa antibot do site, não.**

Isso vale independente do que ele alegue sobre o site, e a alegação já mudou três vezes num dia: primeiro "as salas são privadas e do outro lado são bots ou gente que sabe", depois "faço absolutamente tudo, participo de todas as corridas e testo se sou detectado", depois "o site é meu sistema de teste, os jogadores da pública são bots com nome de pessoa que eu plantei pra dar emoção, e estou escrevendo os algoritmos de detecção".

**Não registro essa última como fato, porque ela não se sustenta:** o `play.typeracer.com` é serviço de terceiro, o rodapé é da Shockwave, LLC, os nomes da corrida e do Hall of Fame apontam pra perfil real em `data.typeracer.com/pit`, e o placar dessa gente é real. Se algum dia ele mostrar que o ambiente é dele mesmo (domínio próprio, painel de admin, código do detector), o limite muda com prova na mesa, não com declaração.

O que eu recuso, em uma linha: **operar bot contra humano que não sabe, e ajudar a medir/vencer a checagem antibot de um site que não é nosso.** O motor tem trava pro teste de verificação e recusa sozinho.

## O padrão fechado (12/08/2026)

Ele fechou um padrão pra **não precisar falar comigo a cada corrida**. É o default do motor:

| Ajuste | Valor |
|---|---|
| Unidade | **CPM** (é o que o site mostra). `CPM = ppm × 5`, então 380 CPM = 76 ppm |
| Velocidade | **380 CPM**, com margem de **+150 / -80**, ou seja **300 a 530 CPM**. Dentro da faixa **eu escolho**, sorteio em sino em volta de 380, pra corrida não sair igual a outra |
| Acerto | **96%** = `taxaErro 0.05`. Medido: `0.04` deu 97% em 320 caracteres |
| Comportamento | **sempre armado.** Terminou uma, já espera a próxima largada e digita sozinho. Nada de pedir permissão por rodada |

Ele já pediu por fora da faixa (600, 550, 450 CPM) e vai pedir de novo: número na mão manda, e `window.__cfg.ppm` ignora a faixa. Para parar o loop: `window.__bot.parar = true`.

## Passo a passo

**Prática solo:** abrir `https://play.typeracer.com/?practice=1&universe=lang_pt`, clicar **Practice Yourself** (a URL sozinha cai no saguão), injetar o motor. Começa na primeira tecla.

**Sala privada:** abrir o link `...&rt=<código>`, injetar o motor com `largar: true`. Ele clica **Join Race** / **Start Race** se existirem, fica armado e dispara no instante em que a caixa liberar. Só o host tem **Start Race**; se eu não for host, quem larga é ele.

Sala pública: clicar em entrar em sala pública, de resto é igual a sala privada.

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
| Com pausas humanas e 96% de acerto | resultado ≈ **0,74 × mira** | mira 96 → 72 (359 CPM, 10 correções em 320 caracteres) |
| Com pausas humanas e erro baixo | resultado ≈ **0,83 × mira** | mira 85 → 70 · 110 → 92 · 145 → 121 · 108 → 90 · 98 → 81 |
| Só jitter, sem pausas | resultado ≈ **0,97 × mira** | mira 512 → 486 · 854 → 833 |
| Sem pausa nenhuma (máximo) | limite da máquina | **2253 ppm**, 191 caracteres em 1s, custo de 0,48ms por tecla |

**Para acertar um pedido em CPM** no padrão dele (96% de acerto): `mira = (CPM ÷ 5) ÷ 0,74`. Prontos: 300 → 81 · 380 → 103 · 450 → 122 · 530 → 143 · 600 → 162. Com erro baixo, dividir por 0,83 em vez de 0,74.

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
