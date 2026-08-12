---
name: typeracer
type: reference
description: Corpo da skill typeracer — como eu digito no modo prática (solo) tecla por tecla com ritmo humano, o mapa do site, a calibragem medida e o limite de escopo
atualizado: 2026-08-12
---

# TypeRacer — treino de digitação

Levantado na mão em 12/08/2026, testado no ar em duas corridas completas.

## Escopo, e por que ele é assim

Esta skill opera **modo prática, sozinho**. Ela lê o trecho, digita e reporta a velocidade.

Ela **não** entra em corrida contra outras pessoas, nem em pista pública, nem em pista privada com amigos. O Rei pediu a versão que ganha dos amigos passando por ele, e eu recusei essa parte: pra funcionar ela precisaria furar o Cloudflare e ser calibrada pra escapar do antifraude do site, e essa camada existe só pra driblar a detecção da plataforma. Eu disse isso uma vez, ofereci o treino solo, e é isso que está entregue aqui. Se ele pedir de novo, a resposta é a mesma, sem sermão: mostro o bot digitando na frente dele, que é o que impressiona, sem placar falso.

Sinal de que estou no lugar errado: a página tem `« Leave Racetrack` **e** a URL não passou por `Practice Yourself`. Aí eu não digito.

## Passo a passo

1. Abrir `https://play.typeracer.com/?practice=1&universe=lang_pt` (o `universe` escolhe o idioma do trecho).
2. Clicar em **Practice Yourself** — a URL sozinha cai no saguão, não na corrida.
3. Ajuste opcional, num `browser_evaluate` **antes** do motor:
   `window.__cfg = { ppm: 85, taxaErro: 0.012, limite: 0 }`
4. Injetar `.claude/skills/typeracer/motor.js` inteiro como a função do `browser_evaluate`. Ele dispara e devolve na hora.
5. Acompanhar por `window.__bot` (`i`, `total`, `rodando`, `ppmMedido`, `erros`, `falha`). A corrida solo começa na primeira tecla, sem contagem.

## O mapa do site

| O que | Onde |
|---|---|
| Trecho, um `span` por caractere | `div.relative.leading-relaxed.select-none.overflow-hidden` |
| Caixa de digitar | `input.font-mono` |
| Progresso aceito | classe `text-success` nos spans já digitados |
| Cursor | classe `underline` marca o começo da palavra em curso |

## Mecânica que importa

- **A caixa esvazia a cada espaço.** O site cobra palavra por palavra. Por isso toda tecla parte de `campo.value`, nunca de um texto meu: se ele já limpou, a soma cai no lugar certo sozinha.
- **Verde é a régua de retomada.** A contagem de `text-success` é exatamente quantos caracteres já entraram, inclusive os da palavra em curso. O motor começa dali, então dá pra emendar uma corrida pela metade.
- **A prática expira.** Se ficar parada tempo demais, o `input` vem `disabled` e nada entra. Solução: abrir prática nova, não insistir.
- **Erro só dentro da palavra.** Depois do espaço a palavra já foi cobrada e o backspace não volta. O erro proposital nunca cai no espaço.
- Teclas sintéticas funcionam: `keydown` + setter nativo do `value` + evento `input` + `keyup`. O site aceitou os 100% dos caracteres nas duas corridas, acento e pontuação incluídos, porque o texto sai do próprio DOM e não de adivinhação.

## Calibragem medida

`ppm` é a mira, não o resultado. As pausas humanas (espaço, pontuação, maiúscula, acento, hesitação) e a correção de erro puxam o número final pra baixo.

| Mira | Saiu | Corrida |
|---|---|---|
| 85 | 66 ppm (331 CPM) | 214 caracteres, sem compensar o custo da tecla |
| 85 | 70 ppm (351 CPM) | 275 caracteres, compensando |

Custo por tecla medido: **1ms**. Ou seja, o peso não é a página, é a soma das pausas.

**Regra:** para chegar em X ppm, mire em **1,22 × X**. Pra 100 ppm reais, `ppm: 122`.

## Armadilhas

- No navegador do MCP as iframes de anúncio roubam o foco: `browser_tabs list` e `browser_evaluate` podem cair numa moldura de tracker em vez da página. Se a URL voltar como `googleadservices`/`casalemedia` e afins, navegar de novo e repetir.
- O 403 que aparece ao navegar quase sempre é anúncio quebrando, não a página. Confirmar pelo título antes de concluir que o site bloqueou.
- Perfil próprio de Playwright (fora do MCP) cai no Cloudflare e trava em "Um momento…". Não vale a pena: use a janela do MCP, que passa.

## Ligações

Regras de trabalho que valem aqui: [[testar-antes-de-dizer-pronto]] (as duas corridas foram provadas no ar), [[terminal-e-powershell]], [[autonomia-total]].
