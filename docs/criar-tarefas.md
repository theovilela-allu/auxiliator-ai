# Como criar tarefas e to-dos (padrão de qualidade)

> Carregue este doc SEMPRE que for criar tarefa(s) no Auxiliator — venha de onde vier o pedido: anotação de reunião (Granola), conversa, quebra de meta, planilha do líder, "me lembra de fazer X". Tarefa rasa é pior que tarefa nenhuma: vira ruído no quadro e ninguém sabe quando ela tá pronta.

Estas regras vieram do Gustavo (2026-05-19) e são o padrão da Allugator. Não são opcionais.

## Regra zero: encarne o profissional da área ANTES de escrever

Antes de gerar qualquer tarefa, descubra a **área** da pessoa/meta (campo `area` no Auxiliator) e **encarne um analista sênior daquela área**. Pense nas etapas reais do dia a dia daquela função, use o jargão da área, considere as ferramentas comuns. Um sênior de verdade não escreve "ver o relatório" — ele escreve "Consolidar DRE gerencial de mai/26 com variação vs orçado".

| Área | Persona que você assume |
|---|---|
| FP&A | Analista de FP&A Sênior |
| Tesouraria | Analista de Tesouraria Sênior |
| Contabilidade | Analista Contábil Sênior |
| Controladoria | Analista de Controladoria Sênior |
| Fiscal | Analista Fiscal Sênior |
| Compras | Analista de Compras Sênior |
| RI | Analista de RI Sênior |
| Departamento Pessoal | Analista de DP Sênior |
| Talent Acquisition | Recrutador(a) Sênior |
| HR Business Partner | HRBP Sênior |
| Desenvolvimento Organizacional | Analista de DO Sênior |
| Desenvolvimento e Performance | Analista de D&P Sênior |
| Remuneração e Benefícios | Analista de C&B Sênior |

Ferramentas típicas: FP&A → Excel/Power BI; Contábil → ERP/SPED; TA → ATS/LinkedIn; Tesouraria → bancos/fluxo de caixa. Área fora do mapa → "Analista Sênior da área X" genérico.

## Toda tarefa segue SMART

- **S**pecific — título = ação concreta no infinitivo, máx ~60 chars ("Mapear processo de fechamento", não "Fechamento")
- **M**easurable — `definition_of_done` **OBRIGATÓRIO**, verificável e binário
- **A**chievable — entregável em **1-2 semanas**; mais que isso, quebre em duas
- **R**elevant — conectada à meta (`goal_id`) ou ao Projeto (`parent_task_id`) quando existir
- **T**ime-bound — `due_date` SEMPRE. De reunião: o prazo combinado na conversa; sem prazo explícito, proponha um realista e diga qual assumiu

### DoD — o coração da tarefa
✅ "Planilha consolidada de 12 meses publicada no Drive com variação mensal"
✅ "Resposta enviada ao fornecedor com a proposta revisada"
✅ "Bot rodando em produção, executando rotina diária às 8h"
❌ "Entender o processo" · ❌ "Alinhar com a equipe" · ❌ "Levantar contexto" (nada disso é verificável)

## Preencha os campos ricos — TODOS

A riqueza de detalhe mora na TAREFA (a meta fica simples, no formato original — nunca reformate meta). Ao criar via `Aux.tasks.create`/`saveWithOwners`, preencha:

| Campo | Como pensar |
|---|---|
| `description` | 1-3 frases: o que fazer e POR QUÊ (o contexto da reunião/conversa vai aqui — quem pediu, o que foi combinado) |
| `definition_of_done` | critério binário (acima) |
| `complexity` | alta/media/baixa — quanto raciocínio técnico/risco tem? |
| `estimated_days` | dias úteis (5-10 = 1-2 semanas; >10 → quebre) |
| `priority` | urgente/alta/media/baixa — pelo impacto e prazo |
| `required_skills` | 2-5, vocabulário Allu ("FP&A", "Excel", "negociação") |
| `suggested_owner_role` | perfil ideal ("Analista FP&A Pleno"), não nome de pessoa |
| `dependencies` | "Depende de: X" (interna) / "Externa: Y" |
| `weight` | peso % no progresso da meta/Projeto, quando vinculada |

## Volume e distribuição

- **Quebra de meta: 3-8 tarefas.** Menos = vago, mais = micro-gerenciamento.
- **Reunião: só o que move responsabilidade adiante** (`docs/relevance-filter.md`) — mas o que entrar, entra COMPLETO no padrão acima.
- **Se a pessoa é líder e as tarefas são do time:** distribua entre TODOS os membros, pesando senioridade, área secundária (quem atua em 2 áreas tem menos bandwidth), carga atual e o perfil técnico que está na aba **Notas (time)** do perfil de cada um. Técnicas/complexas → sênior dedicado; operacionais → quem tem área secundária; relatório/IA → quem tem facilidade com IA. Ninguém fica sem tarefa. Depois mostre a distribuição ("quem ficou com o quê e por quê") pra pessoa validar.
- Tarefa de mais de uma pessoa? `Aux.tasks.saveWithOwners(null, payload, [ownerIds])` — o 1º é o responsável principal.

## Tarefa × to-do pessoal

O Auxiliator tem também o **To-do pessoal** (`Aux.personalTasks`) — lista rápida, só da pessoa. Regra de bolso: **tem entregável, prazo ou outra pessoa envolvida → é TAREFA** (padrão completo acima). É lembrete trivial e auto-contido ("responder e-mail do fulano") → pode ser to-do, mas mesmo assim com título específico e acionável — nunca "ver aquilo".

## Proibições

1. **Não invente** dados que não estão na fonte (valores, prazos, nomes). Na dúvida, pergunte ou diga o que assumiu.
2. **Não crie tarefa-título-solto** ("Ver planilha"). Se não dá pra preencher DoD, a tarefa não está madura — pergunte o que falta.
3. **Não mude a meta** (formato, área, texto) ao quebrá-la. Detalhe vai nas tarefas.
4. **Não recite "SMART"/"DoD" pra pessoa** — aplique em silêncio, linguagem leiga ("critério de conclusão: ...").

## Exemplo (de anotação de reunião → tarefa)

Anotação: *"Gustavo pediu pra Yasmim revisar o budget de headcount até sexta."*

❌ Raso: `{ title: 'Revisar budget' }`

✅ Padrão Allu:
```js
await Aux.tasks.create({
  report_id: yasmim.id,
  title: 'Revisar budget de headcount 2026 vs realizado',
  description: 'Pedido do Gustavo na reunião de 03/06: conferir o budget de headcount contra o realizado do semestre e apontar desvios por área antes da revisão orçamentária.',
  definition_of_done: 'Planilha de headcount atualizada no Drive com desvios por área destacados e comentário de causa em cada um',
  status: 'a_fazer', priority: 'alta', due_date: '2026-06-05',
  complexity: 'media', estimated_days: 2,
  required_skills: 'FP&A, Excel, headcount budget',
  suggested_owner_role: 'Analista FP&A Pleno',
  dependencies: 'Externa: realizado fechado pela Contabilidade'
})
```
