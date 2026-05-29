---
name: auxiliator-deep
description: Use quando a pessoa pedir qualquer coisa do Auxiliator — ver/criar/mover/listar tarefa, meta, 1:1, ausência, PDI, pessoa — E no início de cada conversa para garantir a sessão logada. Abre o navegador (Playwright), opera por window.Aux (não por clique). Sempre carregue docs/auxiliator-api.md antes de operar.
---

# Skill: Auxiliator Deep — Operar o sistema pela pessoa

## Quando você está aqui

A pessoa pediu algo que toca o Auxiliator (`auxiliator.vercel.app`). Você vai operar pelo lado dela: ler estado, criar/editar/mover, sempre via porta programática `window.Aux` — não por clique na tela.

## Pré-requisito sempre

Carregue **`docs/auxiliator-api.md`** ANTES de operar. Esse arquivo tem o manual da `window.Aux` (chamadas, enums, fluxo recomendado). Sem ele você adivinha — e adivinhar quebra.

**Exceção — conexão + briefing no boot:** quando você abre esta skill no início da conversa (sem um pedido específico ainda), **não carregue `docs/auxiliator-api.md`** — gasta token e você não vai operar nada complexo. Faça o passo **1** (garantir sessão) e o passo **1.5 (Briefing do dia)** abaixo: puxe `Aux.state()`, monte o panorama do dia e abra a conversa com ele. Carregue o manual completo só quando a pessoa pedir uma operação de fato (criar/mover/editar).

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

> **Boot da conversa:** depois de confirmar a sessão logada, **NÃO pare** — siga pro passo 1.5. O objetivo do boot é abrir a conversa já a par do dia (tarefas da pessoa + do time), não só logar.

### 1.5 Briefing do dia (só no boot da conversa)

Logo após garantir a sessão, puxe `Aux.state()` (ou o cache de ≤15min — passo 2) e monte um panorama **curto**:

- **Tarefas da pessoa:** `state.tasks` com `report_id === viewer.reportId` e status ≠ `concluida` → separe as de **hoje** (`due_date === hoje`), as **vencidas** (`due_date < hoje`) e as **bloqueadas**.
- **Bloqueios esperando ela:** `state.tasks` com `blocked_on_report_id === viewer.reportId` e `status === 'bloqueada'` (alguém pediu a ajuda dela — destaque, é urgente).
- **Se a pessoa for líder** (`viewer.isLeader`): inclua o que pega fogo no time — tarefas **vencidas** e **bloqueadas** de quem está em `viewer.visibleIds` (a sub-árvore dela). Carregue `docs/leadership-mode.md` pro tom de liderança.

Abra a conversa com isso em **1-2 frases**, no tom da persona, destacando só o que importa (vencido > bloqueado > hoje). Não liste tudo. Dia limpo → diga que está limpo e pergunte o que ela quer atacar. Detalhes da varredura por trás disso: passo 3.

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

- **"O que tenho hoje?"** → filtrar `state.tasks` por dono = `viewer.reportId` ou (se líder) por dono ∈ `viewer.visibleIds`, status ≠ concluida, ordenado por due_date.
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
