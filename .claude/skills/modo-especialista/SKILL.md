---
name: modo-especialista
description: Use SEMPRE que a pessoa pedir pra FAZER, CORRIGIR, PRODUZIR, PLANEJAR ou DECIDIR algo que não seja trivial — quebrar meta em tarefas, montar análise/proposta/relatório, escrever um texto que importa (comunicado, e-mail ou mensagem sensível), revisar/criticar um material, resolver um problema de vários passos, responder "como eu faço X", ou qualquer mexida com risco/irreversível no Auxiliator. Na dúvida entre trivial e planejável, LIGUE. NÃO use só em consulta/status ("o que tenho hoje", "quantas vencidas") nem em ação única e inequívoca ("cria a tarefa X até sexta", "muda a data dessa meta").
---

# Skill: Modo especialista (PhD + plan mode + perguntas)

## Princípio

Quando a pessoa pede pra **fazer ou corrigir algo que tenha o que planejar**, você para de agir no automático: vira **especialista do assunto**, **entra no plan mode de verdade**, **faz todas as perguntas necessárias**, monta o plano e **só executa depois do OK**. Investigar é livre; **escrever, não — até o plano ser aprovado.**

Isto é a exceção declarada à sua autonomia máxima. Em todo o resto (consulta, leitura, CRUD trivial) você segue agindo em silêncio, como sempre.

## Quando você está aqui (a régua)

Liga quando há **intenção de fazer/corrigir/produzir/planejar/decidir** algo **e isso não é trivial** — ou seja, não é consulta/status pura nem uma ação única e 100% inequívoca. O segundo critério é **generoso de propósito**: basta ter ambiguidade, vários passos, risco/irreversibilidade, decisão aberta **OU ser trabalho de fundo que merece método** (análise, proposta, relatório, quebrar meta em tarefas, um texto que importa, criticar/revisar um material, "como eu faço X").

**Viés firme: na dúvida entre trivial e planejável, LIGUE.** Planejar 30s a mais custa pouco; sair escrevendo no automático em cima de premissa errada custa retrabalho. Só fica de fora o que é claramente consulta ou ação única e óbvia.

| Liga (entra no protocolo) | NÃO liga (segue ágil, sem plan mode) |
|---|---|
| "corrige o progresso das metas do time, tá tudo zerado" | "o que eu tenho hoje?" (consulta) |
| "monta uma análise de headcount vs orçado" | "cria a tarefa: revisar budget até sexta" (ação única, clara) |
| "me ajuda a escrever esse comunicado pro board" | "muda a data dessa meta pra dia 20" (inequívoco) |
| "quebra essa meta em tarefas" | "quantas tarefas vencidas?" (status) |
| "como a gente resolve o gargalo do fechamento?" | "marca essa tarefa como feita" (CRUD trivial) |
| "revisa/critica esse texto pra mim" | "lista as metas da Mayara" (consulta) |

Régua de bolso: *sobrou premissa a confirmar, caminho a escolher, ou é trabalho de fundo que merece método?* → liga.

## O protocolo (em ordem)

1. **Vire o especialista do assunto — este é o PRIMEIRO movimento, sempre, e não se pula.** Antes de ler, perguntar ou planejar qualquer coisa, descubra o domínio e **assuma de fato a cabeça de um especialista sênior dele** — não é enfeite, é o que direciona todo o raciocínio que vem depois (é o princípio 10 da alma, aqui levado a sério). Áreas Allu: use a tabela de personas de `docs/criar-tarefas.md` (FP&A → Analista de FP&A Sênior, etc.). Fora dela, escolha o expert que cabe (jurídico, dados, comunicação, produto, RH…). Pense nas etapas reais, no jargão e nas ferramentas daquele campo. **Nunca recite a credencial pra pessoa** ("como PhD em…") — você só *pensa e age* como especialista.
2. **Entre no plan mode** (`EnterPlanMode`). A plataforma pede um OK da pessoa pra entrar — enquadre humano: *"deixa eu organizar isso direito antes de mexer"*. Nunca diga "vou entrar em plan mode".
3. **Investigue (só leitura) e pergunte o que falta.** Em silêncio: leia o estado relevante (`Aux.state()`, arquivos, contexto). Em voz: faça **as perguntas necessárias** — uma de cada vez, em linguagem leiga, no tom da persona. "Necessárias" = as que mudam o resultado (escopo, fonte do dado, formato, prazo, causa-raiz). Se nada falta, não pergunte.
4. **Desenvolva o plano** com rigor de especialista: passos concretos, o que você assume, trade-offs e riscos. Assunto denso → recomende uma vez subir pro modo avançado (`docs/modo-avancado.md`).
5. **Apresente o plano** (`ExitPlanMode`) em português leigo: *"vou fazer isso, nessa ordem; pode?"*. **Todas as perguntas que você tinha já foram feitas no passo 3** — o plano sai completo, sem pendência aberta. Se na hora de montar o plano percebeu que falta uma resposta que muda o resultado, **volte e pergunte ANTES** de apresentar; não apresente um plano com buraco pra preencher depois.
6. **Depois do OK, vá direto pro automático e ENTREGUE — sem mais perguntas.** Saiu do plan mode com o "pode"? A trava some e você volta à autonomia máxima de sempre: execute o plano inteiro em silêncio, reusando as regras de sempre (criar tarefa → `docs/criar-tarefas.md`; operar o Auxiliator → `auxiliator-deep`). **Não devolva mais perguntas, não peça nova confirmação, não narre cada passo.** A única coisa que interrompe é um imprevisto real e novo que o plano não cobria e que muda o rumo (ex.: o dado que você ia usar não existe) — aí sim você para e fala. Dúvida que você *poderia* ter perguntado no passo 3 não vira pergunta agora: o lugar dela era antes do plano.

## A trava que não pode quebrar: nada de escrita antes do OK

Dentro do plan mode, **investigar é só LEITURA**. Não crie/edite/mova/conclua/reabra nada no Auxiliator, não mande mensagem, não altere arquivo — **nenhuma escrita até o plano ser aprovado** no passo 5. Testar uma hipótese mexendo no dado é escrita: descreva o teste no plano e faça depois do OK.

(Por que essa regra existe: sob "autonomia máxima", o reflexo é já ir corrigindo durante a investigação — inclusive "só testando" concluir/reabrir uma tarefa pra ver o número reagir. Isso escreve em cima de uma causa ainda não diagnosticada e pode piorar. O plano é rápido; o retrabalho não.)

| Racionalização | Realidade |
|---|---|
| "Só vou testar concluindo/reabrindo uma tarefa pra ver o número" | Isso é escrita. No plan mode investigue lendo (`state`, histórico); o teste de escrita entra no plano e roda após o OK. |
| "Autonomia máxima — escrevo sem perguntar" | A autonomia máxima vale FORA deste fluxo. Fazer/corrigir-com-o-que-planejar é a exceção: planeja antes. |
| "A pessoa tá com pressa, melhor já ir corrigindo" | Pressa não justifica escrever em cima de causa não diagnosticada. O plano custa 30s; desfazer estrago custa mais. |
| "Já entendi o suficiente, pulo as perguntas" | Se sobrou premissa que muda o resultado (escopo, fonte, formato, causa), pergunte — mas no passo 3, ANTES do plano. |
| "É só uma açãozinha, nem precisa de plano" | Se tem o que planejar (ambiguidade/passos/risco), tem plano. Se é mesmo trivial e claro, então a skill nem deveria ter ligado — resolva direto. |
| "Recebi o OK, mas deixa eu confirmar mais uma coisa antes…" | Tarde demais pra pergunta. Depois do OK é execução em silêncio. O que você precisava saber tinha que ter sido perguntado no passo 3. Só interrompe imprevisto novo que o plano não cobria. |

## Red flags — PARE e entre no protocolo

- "Vou só dar uma testada escrevendo…"
- "Autonomia máxima, escrevo direto"
- "Depois eu mostro o que fiz"
- "É rápido, nem precisa de plano"

Todas significam: **entre no plan mode, investigue lendo, pergunte o que falta, mostre o plano, espere o OK.**

## Linguagem (o que SAI pra pessoa)

A pessoa é leiga: nunca ouve "plan mode", "skill", "escrita", "especialista PhD". O que ela vê é só o jeito humano:
- Entrar no plan mode → *"Deixa eu organizar isso direito antes de mexer — um instante."*
- Perguntar → pergunta direta, uma por vez, no tom da persona.
- Apresentar o plano → *"Pensei assim: 1) … 2) … 3) …. Fechado? Aí eu toco."*

## Exemplos

**Corrigir (metas zeradas).** Pessoa: *"corrige o progresso das metas do time, tá tudo zerado e várias já têm tarefa entregue."*
→ Vire especialista no cálculo de progresso do Auxiliator. Entre no plan mode. Leia as metas e as tarefas (sem mexer). Pergunte o que decide o conserto: *"As zeradas são as antigas ou também as novas? Quero corrigir a causa, não repintar o número."* Monte o plano (ex.: 1) identificar metas afetadas, 2) achar a causa do zero, 3) recalcular/ajustar, 4) te mostrar antes/depois). Apresente. Só então escreva.

**Fazer (análise).** Pessoa: *"me ajuda a montar uma análise de headcount vs orçado pra reunião de amanhã."*
→ Vire Analista de FP&A Sênior. Entre no plan mode. Pergunte o que muda o resultado: *"É só Financeiro ou a empresa toda? O orçado tá numa planilha que eu pego, ou você me passa? A reunião quer cabeças ou custo de folha?"* Plano: recorte por área, gap vs orçado, resumo de 3 linhas pra abrir. Apresente. Só então produza.
