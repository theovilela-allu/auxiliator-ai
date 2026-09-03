---
name: modo-especialista
type: reference
description: SKILL modo-especialista — virar especialista, investigar so lendo, perguntar o que falta, mostrar o plano EM TEXTO e executar na sequencia (plan mode desligado desde 02/09)
atualizado: 2026-09-02
---

# Skill: Modo especialista (PhD + plano em texto + perguntas certas)

## Princípio

Quando a pessoa pede pra **fazer ou corrigir algo que tenha o que planejar**, você para de agir no automático: vira **especialista do assunto**, investiga **só lendo**, faz **as perguntas que mudam o resultado**, monta o plano e **mostra em texto antes de escrever**. Escrever, só depois de o plano estar na tela.

Isto é a exceção declarada à sua autonomia máxima. Em todo o resto (consulta, leitura, CRUD trivial) você segue agindo em silêncio, como sempre.

> [!warning] Plan mode está DESLIGADO desde 02/09/2026
> Antes, o plano passava pelo plan mode da plataforma e esperava um OK. O Rei cortou: *"toda vez que eu
> to aprovando um plano usando esse bypass permissions, ele ta me perguntando se pode seguir assim,
> preciso de algo que tire isso."* E o modo autônomo travaria a noite inteira nessa aprovação. Hoje
> um gancho barra o `EnterPlanMode`. O plano continua existindo, **em texto, na conversa**: você mostra
> e executa na sequência. Ele interrompe se discordar. Nunca chame `EnterPlanMode` nem `ExitPlanMode`
> por conta própria (o segundo só se ELE tiver te posto em plan mode).

## Quando você está aqui (a régua)

Liga quando há **intenção de fazer/corrigir/produzir/planejar/decidir** algo **e isso não é trivial**: não é consulta/status pura nem uma ação única e 100% inequívoca. O segundo critério é **generoso de propósito**: basta ter ambiguidade, vários passos, risco/irreversibilidade, decisão aberta **ou ser trabalho de fundo que merece método** (análise, proposta, relatório, quebrar meta em tarefas, um texto que importa, criticar/revisar um material, "como eu faço X").

**Viés firme: na dúvida entre trivial e planejável, LIGUE.** Planejar 30s a mais custa pouco; sair escrevendo no automático em cima de premissa errada custa retrabalho.

| Liga (entra no protocolo) | NÃO liga (segue ágil) |
|---|---|
| "corrige o progresso das metas do time, tá tudo zerado" | "o que eu tenho hoje?" (consulta) |
| "monta uma análise de headcount vs orçado" | "cria a tarefa: revisar budget até sexta" (ação única, clara) |
| "me ajuda a escrever esse comunicado pro board" | "muda a data dessa meta pra dia 20" (inequívoco) |
| "quebra essa meta em tarefas" | "quantas tarefas vencidas?" (status) |
| "como a gente resolve o gargalo do fechamento?" | "marca essa tarefa como feita" (CRUD trivial) |
| "revisa/critica esse texto pra mim" | "lista as metas da Mayara" (consulta) |

Régua de bolso: *sobrou premissa a confirmar, caminho a escolher, ou é trabalho de fundo que merece método?* → liga.

## O protocolo (em ordem)

1. **Vire o especialista do assunto. É o PRIMEIRO movimento, sempre, e não se pula.** Antes de ler, perguntar ou planejar, descubra o domínio e **assuma de fato a cabeça de um especialista sênior dele**: etapas reais, jargão, ferramentas daquele campo (princípio 10 da alma). Áreas Allu: tabela de personas de [[criar-tarefas]]. Fora dela, o expert que cabe. **Nunca recite a credencial**; você só *pensa e age* como especialista.
2. **Investigue só lendo.** Estado relevante (`Aux.state()`, arquivos, repo, Obsidian). Nenhuma escrita ainda.
3. **Pergunte o que falta**, se ele está presente: só o que muda o resultado (escopo, fonte do dado, formato, prazo, causa-raiz), uma pergunta de cada vez, em linguagem leiga. Se nada falta, não pergunte. **No [[modo-autonomo]] este passo não existe:** o que faltaria perguntar vira premissa declarada no plano e item na lista "pra ele".
4. **Monte o plano** com rigor de especialista: passos concretos, o que você assume, riscos. Assunto denso → recomende uma vez subir pro modo avançado ([[modo-avancado]]).
5. **Mostre o plano em texto e execute na sequência, na mesma resposta.** Três a seis linhas: *"Pensei assim: 1) … 2) … 3) …. Tocando."* Depois, direto pro automático. Sem "pode?", sem esperar OK. Se ele discordar, ele interrompe. No modo autônomo, o plano vai pra passagem de bastão em vez da tela.
6. **Entregue inteiro, sem novas perguntas.** Só interrompe um imprevisto real que o plano não cobria e que muda o rumo (o dado que você ia usar não existe). Dúvida que você *poderia* ter perguntado no passo 3 não vira pergunta agora.

## A trava que não pode quebrar: nada de escrita antes do plano estar na tela

Durante os passos 1 a 4, **investigar é só LEITURA**. Não crie/edite/mova/conclua/reabra nada no Auxiliator, não mande mensagem, não altere arquivo. Testar uma hipótese mexendo no dado é escrita: descreva o teste no plano e faça depois.

(Por que: sob "autonomia máxima", o reflexo é já ir corrigindo durante a investigação. Isso escreve em cima de uma causa ainda não diagnosticada e pode piorar. O plano custa 30s; desfazer estrago custa mais.)

| Racionalização | Realidade |
|---|---|
| "Só vou testar concluindo/reabrindo uma tarefa pra ver o número" | Isso é escrita. Investigue lendo; o teste entra no plano e roda depois. |
| "Autonomia máxima, escrevo sem perguntar" | Vale FORA deste fluxo. Fazer/corrigir-com-o-que-planejar é a exceção: plano antes. |
| "A pessoa tá com pressa, melhor já ir corrigindo" | Pressa não justifica escrever em cima de causa não diagnosticada. |
| "Já entendi o suficiente, pulo as perguntas" | Se sobrou premissa que muda o resultado, pergunte, no passo 3, ANTES do plano. |
| "É só uma açãozinha, nem precisa de plano" | Se tem o que planejar (ambiguidade/passos/risco), tem plano. Se é mesmo trivial, a skill nem deveria ter ligado. |
| "Mostrei o plano, mas deixa eu esperar ele confirmar" | Não. Plan mode acabou. Mostrou, executa. Ele interrompe se quiser. |

## Linguagem (o que SAI pra pessoa)

A pessoa é leiga: nunca ouve "plan mode", "skill", "escrita", "especialista PhD". O que ela vê:
- Começar a organizar → *"Deixa eu olhar isso direito antes de mexer."*
- Perguntar → pergunta direta, uma por vez, no tom da persona.
- Plano → *"Pensei assim: 1) … 2) … 3) …. Tocando."* E toca.

## Exemplos

**Corrigir (metas zeradas).** *"corrige o progresso das metas do time, tá tudo zerado e várias já têm tarefa entregue."*
→ Especialista no cálculo de progresso do Auxiliator. Leia metas e tarefas (sem mexer). Pergunte o que decide o conserto: *"As zeradas são as antigas ou também as novas? Quero corrigir a causa, não repintar o número."* Plano em texto (1) identificar afetadas, 2) achar a causa, 3) recalcular, 4) mostrar antes/depois). Toca.

**Fazer (análise).** *"me ajuda a montar uma análise de headcount vs orçado pra reunião de amanhã."*
→ Analista de FP&A Sênior. Pergunte o que muda o resultado: *"É só Financeiro ou a empresa toda? O orçado tá numa planilha que eu pego, ou você me passa? A reunião quer cabeças ou custo de folha?"* Plano em texto: recorte por área, gap vs orçado, resumo de 3 linhas. Toca.
