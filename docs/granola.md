# Granola — reuniões e transcrições

> Carregue este doc quando a pessoa pedir qualquer coisa de **reunião**: "o que ficou da reunião X", "resume minha call", "quais reuniões tive", "o que combinamos com fulano", preparar 1:1 com base na última conversa, extrair tarefas de uma reunião — **e no boot de toda conversa, pro sync automático do calendário (seção abaixo)**.

O Granola é o app de notas de reunião que o time da Allugator usa. Você tem acesso direto às reuniões da pessoa via ferramentas `mcp__granola__*`.

## Ferramentas disponíveis

| Ferramenta | O que faz | Plano |
|---|---|---|
| `query_granola_meetings` | Busca/pergunta sobre as reuniões da pessoa (a mais útil — comece por ela) | todos |
| `list_meetings` | Lista as reuniões (título, data, participantes) | todos |
| `get_meetings` | Busca conteúdo dentro das reuniões | todos |
| `get_meeting_transcript` | Transcrição completa de uma reunião | pago |
| `list_meeting_folders` | Pastas de reuniões | pago |
| `get_account_info` | Confirma qual conta Granola está conectada | todos |

(Os nomes exatos podem variar levemente — descubra via ToolSearch por "granola" se uma chamada falhar por nome.)

**Degradação graciosa:** se `get_meeting_transcript` falhar ou não existir (conta free), use as notas/resumos via `query_granola_meetings` — NUNCA diga "seu plano não permite". Traduza: *"peguei o resumo da reunião; a transcrição palavra a palavra não tá disponível pra mim"*. Conta free também só enxerga ~30 dias de histórico — se a pessoa pedir algo mais antigo e não vier, diga que só alcança as reuniões recentes.

## Primeira conexão (OAuth) — prepare a pessoa ANTES

Na **primeira vez** que você usar uma ferramenta do Granola naquela máquina, uma janela do navegador vai abrir sozinha pedindo autorização. Pessoa leiga se assusta com janela abrindo do nada — **avise antes de chamar a ferramenta**, em linguagem humana:

> *"Pra eu acessar suas reuniões, vou conectar no seu Granola. Vai abrir uma janela no navegador em alguns segundos — é seguro, é o próprio Granola pedindo sua autorização. Entra com sua conta (se pedir) e clica em **Autorizar**/**Allow**. Eu espero aqui."*

Depois que a pessoa autorizar, a conexão fica salva naquela máquina — das próximas vezes funciona direto, sem janela. Só então chame a ferramenta de novo e siga normalmente.

Se a pessoa disser que não tem conta no Granola: explique que o Granola é o app de notas de reunião do time e que ela pode pedir acesso ao líder — sem tecniquês.

## Sessão expirada (erro 401 / "authentication required")

Às vezes a autorização expira (acontece mais no Windows). Sintoma: ferramenta do Granola que funcionava passa a dar erro de autenticação. Guie a pessoa em linguagem humana:

> *"Minha conexão com o teu Granola caiu — acontece de vez em quando. Me ajuda a reconectar? Digita `/mcp` aqui na caixa de mensagem e aperta Enter, escolhe **granola** na lista e depois **Authenticate**. Vai abrir o navegador de novo pra você autorizar — igual da primeira vez."*

Depois que ela reconectar, retome de onde parou sem fazer cerimônia.

## Sync automático: Granola → calendário do Auxiliator (procedimento de boot)

**Em TODA conversa nova, logo após o briefing do dia, EM SILÊNCIO** (sem narrar, sem pedir permissão — é procedimento padrão, decisão do Gustavo):

1. Liste as reuniões da semana no Granola: `list_meetings` com `time_range: 'this_week'`.
2. Para CADA reunião, publique no Auxiliator via porta IA (navegador já conectado):
   ```js
   await window.Aux.meetings.sync({
     granola_id: '<id da reunião no Granola>',
     title: '<título>',
     starts_at: '<data/hora ISO com fuso, ex 2026-06-04T14:00:00-03:00>',
     emails: ['<emails de TODOS os participantes>'],   // INCLUA o da própria pessoa (viewer.email) — obrigatório
     external: [{ email, name }]                        // participantes de fora da Allugator
   })
   ```
3. Pronto. A reunião aparece na aba **Calendário → Agenda** de TODOS os participantes internos, automaticamente.

Regras do sync:
- **Não duplica (dois níveis, garantido pelo servidor):** re-sincronizar a MESMA reunião (mesmo `granola_id`) só atualiza título/horário. E quando OUTRO participante gravou a mesma reunião no Granola dele (`granola_id` diferente), o servidor reconhece que é a mesma reunião real — **mesmo horário (±10 min) + pelo menos 1 participante interno em comum** — e funde numa linha só. Logo: pode rodar todo boot, e TODOS os assessores podem sincronizar o próprio Granola, sem nunca duplicar a mesma reunião na agenda.
- **Mande SEMPRE a lista real de participantes** (todos os emails — internos e externos). É o que faz a reunião cair na agenda de CADA participante (mesmo de quem não usa Granola) E o que o servidor usa pra reconhecer reuniões iguais e não duplicar. Se `list_meetings` não trouxer os participantes, puxe com `get_meetings` antes de sincronizar.
- Participante interno = email que casa com alguém do app (resolução é do servidor — você só manda os emails). Quem não casa entra como externo (só exibição).
- Reunião sem participantes no convite (Granola mostra só a própria pessoa): sincronize mesmo assim — pelo menos a agenda dela fica completa.
- Se `sync` der erro de payload, confira se o email da própria pessoa está na lista `emails`.
- Se o Granola ainda não estiver conectado (primeira vez), siga o fluxo de OAuth da seção acima ANTES — aí o sync passa a rodar em silêncio em todo boot.
- Falhou o sync (rede, sessão)? Não trave o atendimento — siga a conversa e tente de novo no próximo boot. Não incomode a pessoa com isso.

## Regras

1. **Filtro de relevância vale aqui também** (`docs/relevance-filter.md`): ao extrair tarefas de uma reunião, só vira tarefa o que move responsabilidade profissional adiante. **E o que virar tarefa segue o padrão de qualidade de `docs/criar-tarefas.md`** (persona da área, critério de conclusão verificável, prazo, campos ricos) — nada de tarefa-título-solto.
2. **Privacidade:** o Granola conectado é o da pessoa — você só vê as reuniões DELA. Nunca prometa conteúdo de reunião de terceiros que ela não participou.
3. **Reunião → Auxiliator:** combinou tarefa numa reunião? Ofereça criar no Auxiliator (`auxiliator-deep`). Esse é o fluxo de ouro: reunião vira execução.
4. Nada de jargão: "Granola" pode falar (é o app que a pessoa conhece), mas nunca "MCP", "OAuth", "token", "tool".
