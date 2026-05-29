---
name: subir-metas
description: Use quando um LÍDER quiser subir/importar as metas da equipe pro Auxiliator — gatilhos como "sobe essas metas", "importa as metas do meu time", "tenho as metas da galera aqui", a partir de planilha, documento, PDF, print, texto colado ou conversa. Cria as metas (multi-dono quando há vários responsáveis) via window.Aux e reporta. NÃO cria tarefas nem pesos — isso é de cada pessoa.
---

# Skill: Subir metas da equipe (líder)

## Quando você está aqui

Um líder tem as metas do time em algum lugar — planilha, documento, PDF, print, mensagem, ou só vai te ditar — e quer que você lance tudo no Auxiliator de uma vez. Você lê o que vier (qualquer formato), entende, cria as metas pras pessoas certas e reporta.

**Fora do seu escopo aqui:** criar **tarefas** e definir **pesos**. Isso é de cada pessoa dona da meta, depois. No fim, lembre o líder disso.

## Pré-requisitos

- Faz sentido pra **líder** (ou `both`). Se a pessoa for `individual` (sem time), confirme uma vez se ela quer subir metas só pra ela mesma — siga, mas sem multi-dono de terceiros.
- Garanta sessão logada (abra `auxiliator-deep`, passo 1) e **carregue `docs/auxiliator-api.md`** (manual da `window.Aux` — você vai escrever no Auxiliator). Carregue `docs/leadership-mode.md` pro tom de líder.

## Fluxo

### 1. Pegar a entrada (qualquer formato)
O líder pode te dar de tudo:
- **Arquivo (caminho):** leia com a melhor ferramenta —
  - `.csv` / `.txt` / `.md`: Read direto.
  - `.pdf`: Read (suporta PDF).
  - **Planilha `.xlsx` / `.xls`:** o Read não abre binário. Converta rápido com um script (python com `openpyxl`/`pandas`, ou node) pra CSV/JSON e leia. Se não houver lib instalada, peça pro líder exportar como CSV. Não trave — ache o caminho.
  - **Imagem / print da planilha:** Read (você enxerga imagem).
- **Texto colado ou conversa:** use direto.

Se ele não disse onde estão as metas, pergunte **uma vez**, em linguagem leiga: *"Me manda como você tem — pode ser planilha, um print, ou só colar aqui."*

### 2. Extrair pra uma lista canônica
De qualquer formato, monte internamente uma lista. Cada meta tem:
- **`responsaveis`** — nome(s) da(s) pessoa(s) dona(s): 1 nome (meta individual) ou vários (meta **compartilhada**).
- **`titulo`** — o texto da meta. **Obrigatório.**
- `descricao` — detalhe, se houver.
- `tipo` — se o material distinguir (meta/okr/etc.); senão use o default válido de `Aux.enums`.
- `prazo` — data, se houver (ISO `AAAA-MM-DD`).

Ignore colunas de tarefa / peso / progresso — não é seu escopo aqui.

### 3. Resolver pessoas → ids
Rode `Aux.state()` antes, depois pra cada nome use `Aux.findPerson(nome)`:
- **Não resolveu, ou ambíguo (2+ pessoas plausíveis):** este é o **único** caso em que você PARA e pergunta — sem dono válido a meta não pode ser criada. Junte todos os nomes problemáticos numa pergunta só: *"Não achei 'Fulano' no Auxiliator — é a 'Fulana de Tal'? E 'X', você quis dizer 'Y'?"*
- **Fora do seu time (RLS vai barrar):** se o id não está em `viewer.visibleIds`, avise que você não tem permissão de criar meta pra essa pessoa e **pule** essa — não trave o resto do lote.

### 4. Anti-duplicata
Antes de criar, compare com as metas que já existem (`state.goals`). Se já houver meta com **título igual** (case-insensitive, espaços normalizados) **E** pelo menos um dono em comum, **PULE** e registre como "já existia". Isso evita lixo se você rodar duas vezes ou se os arquivos se sobrepuserem.

### 5. Criar — direto, sem pedir confirmação
Pra cada meta nova:
```js
await Aux.goals.saveWithOwners(null,
  { report_id: <id do 1o responsavel>, title, description, type, status, progress: 0, due_date },
  [<ids de TODOS os responsaveis>]);
```
- `report_id` = 1º responsável (dono principal). A lista de owners inclui **todos** — é daí que sai o multi-dono.
- `status` / `type`: use só valores válidos de `Aux.enums` (confira em runtime). Como tarefas e pesos virão depois, comece a meta **não iniciada** com `progress: 0`.
- Crie **uma a uma**. Se alguma falhar, registre o erro e siga as outras — não aborte o lote inteiro.

### 6. Reportar (humano, no tom da persona)
Resumo limpo, agrupado por pessoa. Ex.:
> Subi 9 metas pro time:
> • **Mayara** — 3 metas
> • **Theo** — 2 metas
> • **Compartilhada** (Mayara + Theo) — "Fechar conciliação Q2"
>
> Pulei 1 que já existia ("X"). Não identifiquei "Fulano" — me confirma quem é que eu lanço.
>
> Agora cada pessoa entra no Auxiliator e cria as tarefas dela dentro dessas metas, com os pesos. Quer que eu avise o time?

Nunca despeje JSON nem id. Sempre nome resolvido.

## O que NÃO fazer
- Não criar tarefas nem definir pesos (escopo da pessoa dona da meta).
- Não confirmar item a item — cria direto (só para em nome irresolvível).
- Não inventar dono: meta sem responsável identificado **não** é criada.
- Não tocar em metas já existentes (a não ser pular duplicata) nem em `historical_kr`.
