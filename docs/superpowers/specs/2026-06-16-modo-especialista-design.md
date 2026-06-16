# Design — skill `modo-especialista`

> Data: 2026-06-16 · Repo: auxiliator-ai · Status: aprovado (Theo), pronto pra plano de implementação.

## Problema

Hoje o assessor é ótimo no dia a dia ágil (panorama do dia, CRUD do Auxiliator, recados), mas trata um pedido de **fazer/corrigir algo não-trivial** com a mesma pegada autônoma de "aja em silêncio, escreve sem perguntar". Resultado: em tarefa que exige domínio (uma análise, uma correção delicada, um documento crítico) ele chuta premissas em vez de investigar, e executa sem alinhar o caminho. Falta um modo deliberado de "parar, virar especialista, entender de verdade e planejar antes de agir".

## Objetivo

Quando a pessoa pede ajuda pra **fazer ou corrigir algo que tenha o que planejar**, o assessor:
1. encarna um **especialista PhD no domínio do assunto**;
2. **entra no plan mode de verdade** (o mesmo Shift+Tab do Claude Code, via `EnterPlanMode`);
3. **faz todas as perguntas necessárias** pra entender o pedido;
4. desenvolve a ideia/plano com rigor de especialista;
5. apresenta o plano e só **executa depois do OK** (`ExitPlanMode`).

Tudo isso por conta própria — a pessoa não precisa pedir "entra no plan mode" nem "vira especialista".

## Não-objetivos (YAGNI)

- Não alterar o plan mode da plataforma além do enquadramento de fala (o micro-OK de entrada do `EnterPlanMode` é comportamento do Claude Code e fica como está).
- Não criar personas novas de **estilo de conversa** (Mordomo/Chefe de Gabinete/Socrático continuam intactos).
- Não reescrever `auxiliator-deep` nem `criar-tarefas` — apenas referenciá-los.
- Não criar gatilho pra consulta/status ("o que tenho hoje") nem pra CRUD trivial.

## Gatilho (o que liga e o que NÃO liga)

**Liga** quando estão presentes os DOIS:
- (a) **intenção de fazer/corrigir/produzir/resolver** algo (não é consulta pura); e
- (b) **há o que planejar**: ambiguidade, múltiplos passos, risco/irreversibilidade, ou decisão aberta.

Exemplos que ligam: "me ajuda a corrigir o cálculo de progresso dessas metas", "monta uma análise de headcount vs orçado", "arruma esse e-mail pro board", "como a gente resolve esse gargalo no fechamento".

**NÃO liga** (segue no modo Jarvis ágil de sempre, sem plan mode):
- Consulta/status: "o que tenho hoje", "quantas tarefas vencidas".
- CRUD trivial e inequívoco: "cria a tarefa X até sexta", "corrige a data dessa meta pra dia 20".
- Conversa do dia a dia, pergunta pontual.

Régua de decisão (o assessor julga): *o pedido é uma ação E sobrou dúvida ou caminho a escolher?* → liga. *Ação única, sem ambiguidade?* → resolve direto.

Isso harmoniza com a doutrina que já existe em `docs/modo-avancado.md` (tarefa densa × leve) e com a própria orientação do `EnterPlanMode` (não usar em tarefa simples).

## Protocolo (a skill, passo a passo)

1. **Reconhecer o domínio e encarnar o especialista PhD.** Descobre o assunto/área e assume a cabeça de um especialista sênior daquele campo. Para áreas Allu, reusa a tabela de personas de `docs/criar-tarefas.md` (FP&A → Analista de FP&A Sênior etc.). Fora dela, escolhe o expert que cabe (jurídico, dados, comunicação, produto…). **Sem recitar credencial** pra pessoa ("como PhD em…") — ele só pensa e age como especialista, sem jargão acadêmico.
2. **Entrar no plan mode** via `EnterPlanMode`. A plataforma pede um micro-OK da pessoa pra entrar; o assessor enquadra isso em linguagem humana ("deixa eu organizar isso direito antes de mexer"), nunca como "vou entrar em plan mode".
3. **Investigar como o especialista investigaria.** Em silêncio: ler o estado relevante (Auxiliator via `Aux.state()`, arquivos, contexto). Em voz: **fazer todas as perguntas necessárias** — uma de cada vez, em linguagem leiga, no tom da persona ativa. "Necessárias" é a régua: se já está tudo claro, não pergunta à toa; se falta o que define o trabalho (premissa, prazo, formato, fonte do dado), pergunta antes de planejar.
4. **Desenvolver a ideia/plano** com rigor de especialista: passos concretos, trade-offs relevantes, o que está assumindo, riscos. Se o assunto for **denso**, recomendar uma vez subir pro modo avançado (compõe com `docs/modo-avancado.md`).
5. **Apresentar o plano** via `ExitPlanMode`, escrito em português leigo — "vou fazer isso, nessa ordem; pode?". A pessoa aprova.
6. **Executar** após o OK, reusando as regras existentes: se for criar tarefa, segue `docs/criar-tarefas.md`; se for operar o Auxiliator, segue `auxiliator-deep`; etc.

## Persona PhD — eixo ortogonal

A persona PhD é o eixo de **profundidade de domínio**. É independente do eixo de **estilo de conversa** (Mordomo/Chefe de Gabinete/Socrático), que continua valendo normalmente. Virar PhD muda *o que* o assessor sabe e investiga, não *como* ele fala. Generaliza o "encarne o analista sênior da área antes de escrever" que hoje só existe escopado em `criar-tarefas.md`, levando pra qualquer assunto.

## Convivência com a alma (`CLAUDE.md`)

Estas ressalvas curtas entram no `CLAUDE.md` (a alma é sempre lida; o gatilho precisa morar nela pra disparar com confiabilidade — a skill detalhada carrega sob demanda):

- **Tabela "Quando abrir qual skill":** +1 linha — *"Pedir ajuda pra fazer/corrigir algo que tenha o que planejar (análise, correção delicada, documento crítico, problema aberto) → `modo-especialista`"*.
- **Seção "Autonomia":** ressalva — pedido de **fazer/corrigir com o que planejar** é a exceção ao "aja em silêncio, não pergunte"; nesse caso ele entra no plan mode, pergunta e planeja antes de executar. (Consulta, CRUD trivial e leitura seguem autônomos como hoje.)
- **Respostas curtas:** dentro do plan mode, perguntar e apresentar o plano é permitido (exceção explícita ao "1-3 frases"); fora do plan mode, segue curto.
- **Linguagem proibida:** nunca dizer "plan mode" / "skill" pra pessoa; enquadrar humano.

## Requisito adicional — modo padrão = o último que a pessoa deixou

Decisão do Theo (16/06): **cancelar o "sempre Sonnet"**. Hoje `.claude/settings.json` fixa `"model": "claude-sonnet-4-6"`, o que força Sonnet em **toda** sessão, ignorando o que a pessoa escolheu por último. O comportamento desejado: o assessor roda no **modelo/profundidade de pensamento que a pessoa deixou da última vez**, persistindo entre sessões.

**Mecanismo (confirmado na doc oficial do Claude Code):**
- Remover a chave `"model"` de `.claude/settings.json` (e garantir que `settings.local.json` também não fixe modelo — hoje não fixa).
- Com isso, o controle cai pro settings global do usuário (`~/.claude/settings.json`). Quando a pessoa escolhe um modelo via `/model`, o Claude Code **salva como default** nesse arquivo global e **persiste automaticamente** entre sessões. Idem pro reasoning effort via `/effort` (`effortLevel`).
- Precedência: CLI flag → env var → `settings.local.json` → `settings.json` (projeto) → `~/.claude/settings.json` (global) → default embutido do plano. Sem o pin no projeto, a última escolha global da pessoa vence.
- Clonagem nova, sem escolha prévia → cai no default embutido do plano da pessoa (aceitável: "último modo" pressupõe uso anterior).

**Impacto na alma (precisa de reescrita, senão fica mentindo):**
- `CLAUDE.md`, seção "Modo de pensamento": hoje diz *"Por padrão você roda num modo leve"*. Reescrever pra *"você roda no modo que a pessoa deixou por último (pode ser leve ou avançado) — não assuma que está no leve"*. A doutrina de **recomendar subir** em tarefa densa continua, com a regra que já existe ("se já está no avançado, fique quieto").
- `docs/modo-avancado.md`: mesma reescrita no topo ("Você roda por padrão num modo leve" → "no modo que a pessoa deixou").

**Trade-off (registrado):** o pin em Sonnet provavelmente era escolha de custo/velocidade pro dia a dia. Sem ele, quem tiver o default da conta em Opus roda no Opus por padrão (mais caro/lento no trivial). É a escolha consciente do Theo — honrar o último modo da pessoa acima do custo fixo.

**Relação com a skill:** independente do `modo-especialista` (a skill funciona com qualquer modelo). São dois workstreams no mesmo trabalho: (1) a skill + ressalvas da alma; (2) destravar o modelo + reescrita da doutrina de modo.

## Arquivos tocados

- **Novo:** `.claude/skills/modo-especialista/SKILL.md` — protocolo completo, tabela de personas-PhD (reaproveitando a de `criar-tarefas.md` e estendendo pra domínios fora da Allu), frases-modelo humanas, exemplos de fluxo (ex.: "corrigir cálculo de metas", "montar análise"), e a régua do gatilho.
- **Editar `CLAUDE.md`:** +1 linha na tabela de skills + ressalva na "Autonomia" + reescrita da seção "Modo de pensamento" (não assumir leve).
- **Editar `.claude/settings.json`:** remover a chave `"model"`.
- **Editar `docs/modo-avancado.md`:** reescrever o topo pra não afirmar "padrão = leve".
- **Versão / release:** bump da tag do `auxiliator-ai` (ex. `v0.2.6`) **e** atualizar `ASSISTANT_LATEST` em `js/agent.js` no repo do site + deploy. Sem o bump, a IA não detecta que está atrasada (regra de memória: bumpar versão do assessor no site a cada release).

## Riscos e mitigação

- **Disparo em excesso** (entrar no plan mode quando não precisa): mitigado pela régua dos dois critérios (ação + algo a planejar) e pelos exemplos de "NÃO liga" na skill.
- **Pergunta demais em coisa clara:** mitigado pela régua "todas as **necessárias**" — zero pergunta quando nada falta.
- **Leigo estranhar o plan mode:** mitigado pelo enquadramento humano de fala; o micro-OK de entrada vira "deixa eu organizar isso antes de mexer".
- **Conflito com a identidade Jarvis:** o gatilho é estreito (só fazer/corrigir com o que planejar); todo o resto do dia a dia segue ágil e autônomo.

## Critérios de sucesso

- Pedido de fazer/corrigir não-trivial → o assessor entra no plan mode sozinho, investiga, pergunta o que falta, apresenta plano e só executa após o OK.
- Pedido trivial/consulta → comportamento ágil de hoje, **sem** plan mode.
- Nenhum jargão técnico ("plan mode", "skill") vaza pra pessoa.
- A alma continua ≤1500 tokens; profundidade mora na skill.
