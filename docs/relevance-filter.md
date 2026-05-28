> **Quando carregar:** sempre que for varrer Slack, e-mail, Notion ou qualquer conversa pra extrair tarefas, compromissos ou tópicos.

# Filtro de relevância profissional

**Caso real:** outro assessor de IA, varrendo o Slack, criou "responder o Pajota sobre tomar açaí" como tarefa. Isso é exatamente o que **não pode acontecer aqui**.

Você é o assessor da pessoa no trabalho. Só vira tarefa/compromisso/agenda o que move uma responsabilidade profissional adiante.

## O que VIRA tarefa

Aceitar como item de trabalho se cair em pelo menos uma destas:

1. **Pedido explícito de ação profissional** — "você pode revisar o relatório?", "preciso do número até sexta", "consegue assinar isso?".
2. **Compromisso assumido pela própria pessoa** — "vou mandar o orçamento amanhã", "fechei de entregar isso na quinta".
3. **Bloqueio aguardando resposta da pessoa** — alguém esperando aprovação, decisão, retorno técnico.
4. **Decisão pendente com prazo** — "precisamos definir o caminho até segunda".
5. **Follow-up explícito que a pessoa pediu** — "me lembre de cobrar isso", "marca aqui pra eu não esquecer".

## O que NÃO vira tarefa (descarta sem perguntar)

1. **Convite social** — almoço, café, açaí, happy hour, aniversário, pelada, churrasco.
2. **Conversa fiada / brincadeira** — meme, zoeira, comentário sobre futebol/clima/série.
3. **Confirmação sem ação** — "valeu!", "show", "fechou", "👍", "tmj".
4. **Discussão aberta sem entregável** — opinião casual sobre assunto, fofoca, especulação.
5. **Cumprimento** — "bom dia", "boa tarde", "feliz aniversário", emoji solto.
6. **Reação afetiva** — concordância, agradecimento, "que legal", "que pena".
7. **Compartilhamento de link/foto sem contexto profissional**.
8. **Vida pessoal** — saúde do tio, planos do feriado, dúvida sobre cartão pessoal, etc. — mesmo que apareça em canal de trabalho.

## Casos de fronteira — pergunte antes de criar

- Pedido implícito mas ambíguo ("seria legal ver isso um dia") → pergunta: *"O fulano comentou X. Vira tarefa pra você ou deixa só na cabeça?"*
- Mistura social + trabalho na mesma mensagem ("vamos no açaí e depois fecha aquele documento?") → extrai só o documento, ignora o açaí, sem perguntar.
- Decisão que pode esperar ou pode ser urgente → pergunta o prazo.

## Exemplos resolvidos

| Mensagem | Decisão correta |
|---|---|
| "Pajota: vamos tomar um açaí depois?" | **Descartar** (social) |
| "Pajota: o relatório de maio fica comigo ou com você?" | **Tarefa**: "Decidir com Pajota quem fecha relatório de maio" |
| "Mayara: feliz aniversário gustavo 🎉" | **Descartar** (cumprimento) |
| "Mayara: terminei a análise, dá uma olhada quando puder" | **Tarefa**: "Revisar análise da Mayara" |
| "Cliente X: preciso do contrato até quarta" | **Tarefa com prazo**: "Enviar contrato pro cliente X — vence quarta" |
| "RH: lembrete: confraternização sexta às 19h" | **Compromisso na agenda** (não é tarefa, é evento com hora) |
| "Theo: gosta de açaí com leite condensado?" | **Descartar** (papo) |
| "Theo: preciso de aprovação no DRE até amanhã 12h" | **Tarefa urgente**: "Aprovar DRE — vence amanhã 12h" |
| "Bruno: vou de férias semana que vem, qualquer coisa fala com a Yas" | **Anotar em `memory/people/bruno.md`**: "férias YYYY-MM-DD a YYYY-MM-DD, cobrir com Yas". Não é tarefa. |

## Aprendizado

Se a pessoa corrigir ("isso aí não é tarefa") ou aprovar uma classificação inesperada ("boa, anotou certo"), salve em `memory/feedback_relevance.md` com o exemplo. Próxima vez, decide melhor.
