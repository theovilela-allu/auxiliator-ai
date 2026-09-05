---
name: o-conserto-que-nao-tomou
type: feedback
description: Quando o conserto "nao pega" e o defeito continua igualzinho, quase sempre a pagina esta rodando a versao velha — cache de modulo ou navegacao que so mudou a ancora. Como saber em dez segundos de qual dos dois se trata
atualizado: 2026-09-05
---

# O conserto que não tomou

Nasceu em 05/09/2026, gravando o aparelho do deck em vídeo. Consertei um travamento,
recarreguei, e o travamento continuou. Consertei de novo, de outro jeito. Continuou.
Na terceira eu já estava caçando defeito no lugar errado: **os dois consertos estavam
certos e nenhum dos dois tinha chegado a rodar.**

São duas armadilhas diferentes, e as duas dão exatamente o mesmo sintoma.

## 1. O navegador guarda módulo com unha e dente

Arquivo `.js` importado como módulo fica em cache. O servidor de estudo mais comum
(`python -m http.server`) manda `Last-Modified` e nada mais, e o navegador acha que
pode ficar com o que já tem. Eu edito o disco, recarrego, e a página executa o arquivo
de antes.

**Conserto definitivo, e vale pra qualquer projeto estático:** o servidor de conferência
manda `Cache-Control: no-store`. São seis linhas em cima do `SimpleHTTPRequestHandler`.
Feito assim, recarregar sempre lê o disco. Não dependa de lembrar de apertar
recarregar-forçado: cedo ou tarde você esquece, e o dia que esquecer é o dia em que
vai perder uma hora.

## 2. Trocar só a âncora do endereço NÃO recarrega a página

Ir de `pagina.html#a4900` para `pagina.html#a3500` não é navegação: é rolagem. O
documento continua o mesmo, com o mesmo código na memória, mesmo que o arquivo em disco
tenha mudado dez vezes. Isso vale inclusive quando quem navega é ferramenta de
automação — ela pede o endereço novo, o navegador vê que só a âncora mudou e não faz nada.

**Conserto:** mude alguma coisa ANTES da `#`. Um parâmetro descartável (`?r=2`) já
resolve, e é mais confiável do que confiar no recarregar.

## A prova que separa os dois casos em dez segundos

Deixe uma **marca de versão** no arquivo que você está mexendo:

```js
window.__versaoDisso = 5;   // subo isto toda vez que mexo aqui
```

Aí, na página, `window.__versaoDisso` responde na hora qual das três coisas está
acontecendo: número velho (rodando código velho), número novo (o código é o novo e o
defeito é de verdade), `undefined` (o arquivo nem chegou a executar). Sem essa marca eu
fiquei três rodadas discutindo com a versão errada do meu próprio código.

É irmã da regra de sempre: [[testar-antes-de-dizer-pronto]] só vale se o que está no ar
for o que você acabou de escrever. E é a mesma família do print sem placa de vídeo, em
[[testar-so-o-que-mudou]]: **antes de caçar o defeito, prove que você está olhando pro
objeto certo.**

Ligações: [[testar-antes-de-dizer-pronto]] · [[uma-bateria-conserta-e-segue]] · [[testar-so-o-que-mudou]]
