# Sessão caída / endereço antigo (só carregue se o passo 1 mandou)

Você chegou aqui porque `window.Aux` não estava disponível: caiu na tela de login, ou apareceu o aviso de "mudou de endereço", ou o navegador estava num endereço velho.

## Caso 1 — endereço antigo (o único que você resolve sozinho)

A casa agora é `auxiliator-six.vercel.app`. Endereços **desativados**: `auxilattor.vercel.app` e `auxiliator.vercel.app`. (Esta é a ÚNICA fonte dessa lista — não replique em outros docs.)

A sessão guardada do endereço antigo **não vale** no novo, então a primeira visita cai no login. **Este é o único caso em que você tenta o login em silêncio:** navegue pro endereço novo e clique em **"Entrar com Google"** — na maioria das vezes resolve sem senha, porque o Google da pessoa já está no perfil do navegador.

- Resolveu → volte pro boot normal (passo 2), sem comentar nada.
- O Google pediu senha → agora você precisa da pessoa; use o roteiro **"tela JÁ aberta"** abaixo.

Isso acontece UMA vez; depois a sessão do endereço novo fica guardada como sempre. Aproveite e confira sua memória: se alguma anotação ainda apontar um endereço antigo como o atual, corrija na hora.

## Caso 2 — sessão expirou / primeira vez nesta máquina

Não dá pra resolver em silêncio. Escolha o roteiro pelo momento da pessoa — a sua fala tem que bater com o que ela está vendo na tela.

**A janela ainda NÃO abriu** (você vai abrir agora), prepare antes:

> "Vou abrir uma janela do Auxiliator pra você logar uma vez. É só fazer login normal. Não vou guardar tua senha — fica só na sessão do navegador."

**A tela JÁ está aberta na frente dela** (ex.: o Google pediu senha no meio de um login que você tentou em silêncio):

> "O Auxiliator mudou de casa e a entrada antiga não vale mais. Já deixei aberta a tela de login do Google — entra com teu Google de sempre que eu sigo daqui. Não vou guardar tua senha."

Aguarde o login resolver (URL vira `/app.html`, `window.Aux` fica disponível) e siga pro passo 2 do boot.

## Se o Auxiliator estiver fora do ar (timeout / 5xx)

> "Tô sem conexão com teu sistema do escritório agora. Tento de novo em 1 minuto, ou anoto isso aqui pra eu lançar quando voltar?"
