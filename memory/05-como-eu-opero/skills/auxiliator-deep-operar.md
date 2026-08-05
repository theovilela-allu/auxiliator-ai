---
name: auxiliator-deep-operar
type: reference
description: SKILL auxiliator-deep, parte de operar — como ler e escrever no Auxiliator por window.Aux
atualizado: 2026-08-05
---

# Operar o Auxiliator (só carregue quando for de fato ver/criar/mover/editar)

Sessão já garantida no passo 1 do boot. Carregue **[[api-do-auxiliator]]** junto deste arquivo — ele é o manual completo e **a fonte de verdade**. O atalho abaixo cobre só o caminho comum; se algo divergir, o manual manda.

## Cache do state

- Se `memory/cache/aux-state.json` existe e foi modificado há **menos de 15 minutos**, use o cache em vez de chamar `Aux.state()` de novo.
- Senão, `state = await Aux.state()` e grave o resultado nesse arquivo.
- **Invalide na hora** (delete o arquivo) depois de qualquer escrita sua, ou se a pessoa disser "atualiza" / "olha de novo".
- Nunca chame `Aux.state()` em loop curto. Prefira **filtrar dentro do navegador** e trazer só o resumo — o state inteiro é grande (centenas de tarefas).

## Fluxo

1. **LER** — `const st = await Aux.state()` → `{ viewer, enums, people, goals, tasks, oneOnOnes, absences, weeklys }`, tudo com id.
2. **RESOLVER** — nome→id com `Aux.findPerson('Mayara')`; título→id varrendo `st.goals`. Confira duplicata antes de criar.
3. **VALIDAR** — só valores de `Aux.enums` (é o espelho dos CHECK do Postgres).
4. **ESCREVER** — chamada do módulo certo (manual).
5. **VERIFICAR** — releia e confirme que gravou.

## Atalho dos casos comuns

| Pedido | Chamada |
|---|---|
| "o que tenho hoje?" | filtrar `st.tasks` por `report_id === viewer.reportId` (líder: `∈ viewer.visibleIds`), status ≠ `concluida`, ordenar por `due_date` |
| "cria a tarefa X" | `Aux.tasks.create({ report_id: viewer.reportId, title, status: 'a_fazer', priority: 'media', due_date })` — e **sempre** siga [[criar-tarefas]] (título-ação, critério de conclusão, prazo, campos ricos). Tarefa de uma linha sem critério é proibida |
| "marca como feita" | `Aux.tasks.update(id, { status: 'concluida' })` — não confirma (reversível e é dela) |
| "tarefa pra várias pessoas" | `Aux.tasks.saveWithOwners(idOuNull, payload, [ownerIds])` — `ownerIds[0]` é o dono principal |
| "quem é o líder de X?" | `Aux.findPerson('X')` → `manager_id` → mapear pra nome em `st.people` |
| "trava isso esperando o Gustavo" | `Aux.tasks.setBlock(id, { reason, target_ids: [id] })`; destravar: `Aux.tasks.clearBlock(id, 'em_andamento')` |

Enums que mais pegam: `tasks.status` ∈ `a_fazer|em_andamento|bloqueada|concluida`; `tasks.priority` ∈ `baixa|media|alta|urgente`. Datas ISO `AAAA-MM-DD`. `report_id` é **obrigatório** em tarefa, meta, 1:1 e ausência, e por RLS precisa ser a própria pessoa ou alguém da sub-árvore dela.

**Qualquer coisa fora dessa tabela** (meta, cronograma/entregas, ata de weekly, PDI, ausência, projeto, agenda com hora, publicar reunião, notas privadas, cadastrar pessoa) → veja no manual, não improvise.

## Antes de mexer em coisa de OUTRA pessoa

Atribuir, editar ou apagar algo de terceiro → carregue [[seguranca-e-confirmacao]] e confirme com a pessoa antes. Marcar alguém num bloqueio aparece em vermelho na tela dele: é ação que afeta terceiro.

Se for varrer conversa/e-mail pra extrair tarefa → [[filtro-de-relevancia]].

## Reportar em linguagem humana

> "Criei a tarefa 'Aprovar DRE' pra você, sem prazo definido. Quer que eu marque pra amanhã?"

> "A Mayara tem 3 tarefas vencidas: relatório de junho (3 dias), planilha do C&B (1 dia) e o briefing pro Gustavo (hoje). Te ajudo a rascunhar uma mensagem pra ela?"

Nunca: *"Aux.tasks.create retornou row id ..."*.

Se RLS bloquear (a pessoa não tem permissão): *"Isso aí você não tem permissão pra ver. É da equipe X."* Se o sistema estiver fora do ar, o roteiro está em [[auxiliator-deep-login]].

## O que NÃO fazer

- Não clicar em botão quando existe chamada `Aux.*` equivalente (clique é último recurso: lento e frágil). Todo elemento tem `data-testid` estável, se precisar.
- Não inventar valor de enum — leia `Aux.enums` em runtime.
- Não passar `report_id` de quem a pessoa não enxerga (RLS falha de forma confusa).
- Não criar sem antes checar duplicata no `state()`.
