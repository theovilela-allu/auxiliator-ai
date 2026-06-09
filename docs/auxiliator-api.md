> **Quando carregar este arquivo:** quando a skill `auxiliator-deep` for ativada.
> Não carregar no boot — gasta token. Carrega só quando precisa operar o Auxiliator.
> Fonte: este arquivo é uma cópia versionada do `docs/ai-navigation.md` do repositório do Auxiliator. Sempre que aquele mudar, este precisa ser atualizado.

---

# Auxiliator — Navegação por IA (`window.Aux`)

Como uma IA que dirige o navegador (Playwright) opera o Auxiliator de forma
**rápida, certeira e sem clique**. A UX humana não muda — isto é uma porta adicional.

## Princípio
Não clique na tela pra ler/escrever dados. A tela é lenta e frágil. Use a interface
programática `window.Aux`, disponível no app autenticado (`app.html`), via avaliação de JS
no navegador já logado. Toda operação é governada por **RLS** (a IA só faz o que o usuário
logado pode) e passa pela **mesma sanitização** que a UI humana.

A navegação por clique continua válida como **fallback** — todo elemento interativo tem
`data-testid` estável (convenção `{modulo}-{acao|campo}[-{id}]`, ex.: `goals-create`,
`goal-title`, `goals-delete-{id}`, e no modal de confirmação `confirm-yes`/`confirm-cancel`).

## Fluxo recomendado
1. **LER**: `const st = await window.Aux.state()` → `{ viewer, enums, people, goals, tasks, oneOnOnes, absences }` com ids.
2. **RESOLVER**: casar nome→id com `window.Aux.findPerson('Isa')` e título→id varrendo `st.goals`. Checar duplicatas.
3. **VALIDAR**: usar só valores de `window.Aux.enums` (status, priority, type, absences.type, áreas).
4. **ESCREVER**: chamar o módulo certo (abaixo).
5. **VERIFICAR**: reler `state()` e confirmar que gravou.

## Leitura
| Chamada | Retorna |
|---|---|
| `await Aux.state()` | Tudo de uma vez, com ids |
| `Aux.findPerson(txt)` | Pessoa por nome aproximado (exige `state()` antes) |
| `await Aux.viewer()` | Quem está logado e o que enxerga |
| `Aux.enums` | Valores válidos por tabela.campo |
| `Aux.help()` | Esta referência, em objeto |

## Escrita (governada por RLS)
| Ação | Chamada |
|---|---|
| Criar/editar meta + donos | `await Aux.goals.saveWithOwners(idOuNull, { report_id, title, description, type, status, progress, due_date }, [ownerIds])` — `report_id` é **obrigatório** (dono principal) e retorna **id string** |
| Atualizar/excluir meta | `Aux.goals.update(id, patch)` · `Aux.goals.remove(id)` |
| Criar tarefa (vincular meta via `goal_id`) | `await Aux.tasks.create({ report_id, title, description, definition_of_done, goal_id, status, priority, due_date, weight, ... })` — `weight` (int ≥0, em pontos percentuais) é o peso da tarefa no progresso da meta; `0` = não conta |
| Editar/excluir tarefa | `Aux.tasks.update(id, patch)` · `Aux.tasks.remove(id)` |
| Criar **Projeto** (agrupador local na aba Tarefas) | `await Aux.tasks.create({ report_id, title, description, due_date, is_project: true })` — Projeto é uma task com `is_project=true`; não vira card de coluna, vira bloco 📊 no topo do Kanban |
| Vincular tarefa a um Projeto | `parent_task_id: <id do projeto>` no `tasks.create`/`update` — a filha aparece no board com selo do Projeto; progresso do Projeto = Σpeso concluídas/Σpeso (fallback: contagem), calculado no front |
| **Área** da tarefa/projeto (filtro por área) | Campo opcional `area` (texto) em `tasks.create`/`update`/`saveWithOwners`, vale pra tarefa **e** projeto. É **só exibição**: o filtro por área na aba Tarefas usa a área DA tarefa, não da pessoa. Preencha **somente quando o dono for de mais de uma área** (ex: `"FP&A, Compras"`) pra dizer a qual área a tarefa pertence; dono de área única deixa `null` (fallback pra área do dono → zero migração). Não altera visibilidade/RLS |
| Bloquear tarefa com dependência (MULTI-pessoa) | `await Aux.tasks.setBlock(id, { reason, target_ids: [r1, r2] })` — põe em `bloqueada` e marca UMA OU MAIS pessoas (qualquer uma da empresa). Cada marcada vê em vermelho no Início e na coluna Bloqueada dela. Reseta resposta anterior. A relação mora em `task_block_targets` (não mais em `blocked_on_report_id`, que virou legado) |
| Responder a um bloqueio (sou um dos marcados) | `await Aux.tasks.respondToBlock(taskId, 'resposta', resolved)` — RPC security definer; funciona se EU sou um dos `task_block_targets` e a task está `bloqueada`. `resolved=true` (resposta + atender) resolve: some pra TODOS os marcados e fica verde pra quem bloqueou |
| Ler tarefas bloqueadas em mim | `await Aux.tasks.blockedOnMe()` — RPC; só as atualmente bloqueadas (não resolvidas) em que sou um dos marcados |
| Limpar/resolver bloqueio (lado de quem bloqueou) | `await Aux.tasks.clearBlock(taskId, 'em_andamento')` — apaga os marcados + limpa os campos de bloqueio e (opcional) move de coluna. Usado no "x" do bloqueio verde respondido, ou ao tirar a tarefa de Bloqueada |
| Registrar 1:1 | `await Aux.oneOnOnes.create({ report_id, date, topics: ['t1','t2'], notes, next_topics })` |
| Criar/excluir ausência | `await Aux.absences.create({ report_id, type, start_date, end_date, notes })` |
| PDI da pessoa | `await Aux.pdi.upsertByReport(report_id, { strengths, develop, career_plan })` |
| Notas privadas / do time | `Aux.privateNotes.upsertMine(report_id, txt)` · `Aux.privateNotes.upsertDefault(report_id, txt)` |
| Cadastrar pessoa | `await Aux.reports.create({ name, email, role, area, ... })` |
| Tarefa/Projeto com **vários responsáveis** | `await Aux.tasks.saveWithOwners(idOuNull, payload, [ownerIds])` — espelha o das metas. `ownerIds[0]` = dono principal (o servidor alinha `report_id`); todos os donos no seu escopo. Também: `Aux.tasks.setOwners(task_id, [ids])` e `Aux.tasks.listWithOwners()` (tasks + `owners:[{report_id}]`; sem owners = single-owner legado). A tarefa aparece pra CADA dono e conta **uma vez** no progresso de meta/Projeto |
| **Publicar reunião do Granola** (calendário de todos os participantes) | `await Aux.meetings.sync({ granola_id, title, starts_at, emails: ['a@allugator.com', ...], external: [{email, name?}] })` — idempotente, dedup global por `granola_id` (vários assessores sincronizam a mesma reunião sem duplicar). `emails` que casam com pessoas do app viram participantes internos (resolução server-side); o resto cai em `external`. **O email da própria pessoa PRECISA estar em `emails`** — pegue de `viewer.email`. `starts_at` ISO **com hora e fuso**. Aparece em Calendário → Agenda como 📅 pra cada participante. Procedimento de boot: `docs/granola.md` |
| Ler reuniões visíveis | `await Aux.meetings.listVisible(fromISO?, toISO?)` — retorna `participant_ids` (uuid[]) + `external_participants` |

## Regras
- Datas em ISO `AAAA-MM-DD`.
- Enums **exatos** (ex.: `goals.status` ∈ `nao_iniciada|em_andamento|concluida|cancelada|pausada`;
  `tasks.priority` ∈ `baixa|media|alta|urgente`; `absences.type` ∈ `ferias|falta|folga|afastamento`).
  Sempre confira `Aux.enums` em runtime — é a fonte de verdade (espelha os CHECK do Postgres).
- Leia `state()` **antes** de criar pra não duplicar.
- Meta **não tem** campo Área — a área vem do dono. Não invente campo.
- **`report_id` é obrigatório** em meta, tarefa, 1:1 e ausência, e por RLS precisa ser
  você mesmo (`viewer.reportId`) ou alguém da sua sub-árvore (`viewer.visibleIds`).
  Omitir `report_id` → o INSERT falha com "row violates row-level security policy"
  (não é falta de permissão; é campo faltando). Em meta, costuma ser o 1º `ownerId`.
- **Retornos não são uniformes:** `goals.saveWithOwners` devolve **id (string)**;
  `*.create`/`*.update`/`upsert*` devolvem a **row**; `*.remove` devolve **array** de rows.
- **Nomes de coluna que mudam fácil:** 1:1 usa `date` (não `meeting_at`) e `topics` é
  **array**; ausência usa `notes` (não `reason`); PDI usa `strengths`/`develop`/`career_plan`
  (não `content`). Confira sempre contra uma row real de `state()`.
- **Projeto × Meta são ortogonais:** uma tarefa pode ter `goal_id` E `parent_task_id` ao
  mesmo tempo. Projeto NÃO aparece na aba Metas e não tem registro próprio em `goals` —
  é só uma task agrupadora. Em `state().tasks`, filtre `is_project === true` pra listar
  Projetos e `parent_task_id === <id>` pra listar as filhas.
- **Não confundir** `parent_task_id` apontando pra task-comum (checklist antigo de
  subtarefas, escondido do board) com apontando pra um Projeto (filha visível no board).
  Pra agrupar com visibilidade, o pai precisa ter `is_project: true`.

## Exemplo ponta a ponta
```js
const st = await window.Aux.state();
const isa = window.Aux.findPerson('Isabela Deuner');
// cria meta pra Isa — report_id é obrigatório (aqui = a própria Isa)
const goalId = await window.Aux.goals.saveWithOwners(null,
  { report_id: isa.id, title: 'Fechar conciliação mensal', type: 'meta', status: 'em_andamento', progress: 0, due_date: '2026-06-30' },
  [isa.id]); // saveWithOwners retorna o ID (string), não a row
// cria tarefa vinculada (report_id também obrigatório)
await window.Aux.tasks.create({
  report_id: isa.id, goal_id: goalId, title: 'Levantar pendências',
  status: 'a_fazer', priority: 'alta', due_date: '2026-06-10'
});
```

## Implementação
- `js/agent.js` — define e instala `window.Aux` (chamado em `main.js` após boot).
- Reusa `js/api.js` (CRUD + RLS) e `js/sanitize.js` (`getEnums()` → enums).
- Roadmap: Fase 2 (deep-links de UI), Fase 3 (RPCs Postgres compartilhadas + idempotência).
