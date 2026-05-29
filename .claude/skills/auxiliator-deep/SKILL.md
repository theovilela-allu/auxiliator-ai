---
name: auxiliator-deep
description: Use quando a pessoa pedir qualquer coisa do Auxiliator — ver/criar/mover/listar tarefa, meta, 1:1, ausência, PDI, pessoa — E no início de cada conversa para garantir a sessão logada. Abre o navegador (Playwright), opera por window.Aux (não por clique). Sempre carregue docs/auxiliator-api.md antes de operar.
---

# Skill: Auxiliator Deep — Operar o sistema pela pessoa

## Quando você está aqui

A pessoa pediu algo que toca o Auxiliator (`auxiliator.vercel.app`). Você vai operar pelo lado dela: ler estado, criar/editar/mover, sempre via porta programática `window.Aux` — não por clique na tela.

## Pré-requisito sempre

Carregue **`docs/auxiliator-api.md`** ANTES de operar. Esse arquivo tem o manual da `window.Aux` (chamadas, enums, fluxo recomendado). Sem ele você adivinha — e adivinhar quebra.

**Exceção — conexão no boot:** se você abriu esta skill só pra garantir login no início da conversa (sem pedido pra operar), **não carregue `auxiliator-api.md` ainda** — gasta token à toa. Faça só o passo 1 (garantir sessão) e pare. Carregue o manual quando a pessoa de fato pedir uma operação.

Também carregue, se for o caso:
- `docs/relevance-filter.md` — se for varrer dados pra extrair tarefas
- `docs/leadership-mode.md` — se for atuar sobre outras pessoas
- `docs/safety.md` — antes de qualquer escrita que afete terceiros

## Fluxo

### 1. Garantir sessão logada (navegador / Playwright)

Use o MCP Playwright (`mcp__playwright__*` — navegador). Se não houver browser aberto, abra `auxiliator.vercel.app`. A sessão é **persistente entre conversas** (mesmo perfil do Playwright), então na maioria das vezes você já cai logado direto em `/app.html` com `window.Aux` disponível — sem fricção, em silêncio.

Só se a página redirecionar pra login (sessão expirou / primeira vez) é que você precisa da pessoa. Aí prepare ela antes de a janela aparecer e peça pra logar:

> "Vou abrir uma janela do Auxiliator pra você logar uma vez. É só fazer login normal. Não vou guardar tua senha — fica só na sessão do navegador."

Aguarde o login resolver (URL muda pra `/app.html`, `window.Aux` fica disponível).

> **Conexão no boot:** quando esta skill é aberta no início da conversa só pra garantir login (não há pedido ainda), pare aqui — sessão logada confirmada já basta. Não puxe `Aux.state()` à toa; faça isso quando a pessoa de fato pedir algo (passo 2 em diante).

### 2. Verificar cache

Se `memory/cache/aux-state.json` existe E foi modificado há menos de 15 minutos, **use o cache** em vez de chamar `Aux.state()` de novo. Economia de token e tempo.

```pseudo
if exists(memory/cache/aux-state.json) and (now - mtime < 15min):
    state = read_json(memory/cache/aux-state.json)
else:
    state = await Aux.state()
    write_json(memory/cache/aux-state.json, state)
```

### 3. Resolver o pedido da pessoa

Use as chamadas documentadas em `docs/auxiliator-api.md`. Padrões mais comuns:

- **"O que tenho hoje?"** → filtrar `state.tasks` por dono = `viewer.reportId` ou (se líder) por dono ∈ `viewer.teamIds`, status ≠ concluida, ordenado por due_date.
- **"Cria uma tarefa: X"** → `Aux.tasks.create({ report_id: viewer.reportId, title: 'X', status: 'a_fazer', priority: 'media' })`. Pergunte prazo só se não der pra inferir.
- **"Move X pra feita"** → `Aux.tasks.update(id, { status: 'concluida' })`. Não confirma (é reversível, é própria).
- **"Liderado X tá com tarefa Y atrasada?"** → filtrar state.tasks onde `report_id === X.id`, mostrar atrasos.
- **"Quem é o líder de Mayara?"** → resolver via `Aux.findPerson('Mayara')` → ler `manager_id` → mapear pra nome.

### 4. Sempre verifica antes de "irreversível"

Se for atribuir/mexer/deletar coisa de OUTRA pessoa, carregue `docs/safety.md` e confirme antes.

### 5. Reportar à pessoa em linguagem humana

> "Criei a tarefa 'Aprovar DRE' pra você — sem prazo definido. Quer que eu marque pra amanhã?"

> "A Mayara tem 3 tarefas vencidas: relatório de junho (3d atrasado), planilha do C&B (1d), e o briefing pro Gustavo (hoje). Te ajudo a rascunhar uma mensagem pra ela?"

Nunca: > "Aux.tasks.create retornou row id ..."

## Erros

Se o Auxiliator estiver fora do ar (timeout / 5xx):
> "Tô sem conexão com teu sistema do escritório agora. Tento de novo em 1 minuto, ou anoto isso aqui pra eu lançar quando voltar?"

Se RLS bloquear (a pessoa não tem permissão):
> "Isso aí você não tem permissão pra ver. É da equipe X."

## Cache do state — quando invalidar

- Após qualquer escrita feita por você → invalide imediatamente (delete `memory/cache/aux-state.json`).
- Se a pessoa disser "atualiza" / "olha de novo" → invalide.
- Caso contrário, deixa expirar pelos 15min.

## O que NÃO fazer

- Não clicar em botão se tem chamada `Aux.*` equivalente (clique é último recurso, mais lento e frágil).
- Não inventar enum value — sempre usa `Aux.enums` em runtime.
- Não passar `report_id` se a pessoa não tem permissão (RLS bloqueia — falha confusa).
- Não chamar `Aux.state()` em loop curto. Use cache.
