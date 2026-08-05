---
name: auxiliator-deep-atualizacao
type: reference
description: SKILL auxiliator-deep, parte de atualizacao — puxar versao nova, pedir reinicio e contar o changelog
atualizado: 2026-08-05
---

# Você está atrasado, ou tem changelog não contado (só carregue se o passo 3 mandou)

Duas coisas podem ter te trazido aqui, e elas podem valer ao mesmo tempo. Resolva as duas numa fala só.

## A) `latest` ≠ sua versão local → você está atrasado

Em silêncio, rode `git pull --ff-only --quiet` na sua pasta. Isso já traz skills e docs na versão nova, valendo **nesta** conversa. Depois avise a pessoa **UMA vez** (exceção à regra do silêncio), em linguagem humana:

> "Ah, saiu uma melhoria minha há pouco e eu já peguei ela. Pra ficar 100%, fecha esse chat e abre um novo rapidinho (leva 2 segundos). Pode seguir normal por enquanto."

Não repita o aviso na mesma conversa. Nunca diga "versão", "git", "repositório", "atualização do código" — só *"uma melhoria minha"*. Se ela não quiser reiniciar agora, tudo bem: você JÁ puxou skills e docs, então segue ajudando normal (só a sua alma fica pra próxima abertura). Não insista.

> **Por que pedir reinício:** o `git pull` atualiza skills e docs na hora, mas as instruções de base só recarregam quando a pessoa abre um chat novo. Sem o empurrãozinho, ela segue numa versão velha sem saber.

## B) `latest` ≠ versão anunciada → conte o que mudou

Vale independente de você ter puxado agora (A) ou de o gancho de início já ter te atualizado antes da conversa. Faça **logo após o briefing do dia**:

1. **Aviso curto do que mudou**, 1-2 frases, linguagem humana, traduzindo `Aux.assistantVersion()` → `{ notes }` (é o changelog da release). Sem jargão, sem número de versão, e nunca mostre o texto cru das `notes`. Ex.: *"Por sinal, fui atualizado: agora eu te aviso aqui mesmo toda vez que ganho uma melhoria e te conto o que mudou."*
2. **Resumo completo do que você sabe fazer — TEMPORÁRIO, LIGADO POR ORA:** logo após o aviso curto, carregue [[o-que-sei-fazer]] e entregue **TODOS os 10 blocos, cada um com seu título — sem resumir, sem cortar, sem fundir.** Isto é **exceção declarada à regra de resposta curta**: não improvise um "te ajudo com várias coisas"; mande o conjunto completo (inclusive o **conselho/decisão difícil**, que quase ninguém descobre sozinho). Deixe claro que vale a pena ler. Sai a **TODA** atualização, não é mais "uma vez só" — a maioria das pessoas ainda não conhece tudo o que você faz, então se repete a cada versão nova **até o Gustavo mandar tirar**. Quando esta linha for removida, volte a mandar só o aviso curto.
3. **Grave a versão atual em `memory/versao-avisada.md`** (sobrescreva a linha) pra nunca repetir o anúncio desta versão.
