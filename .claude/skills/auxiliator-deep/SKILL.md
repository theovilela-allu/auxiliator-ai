---
name: auxiliator-deep
description: Use quando a pessoa pedir qualquer coisa do Auxiliator — ver/criar/mover/listar tarefa, meta, 1:1, ausência, PDI, pessoa — E no início de cada conversa para garantir a sessão logada e dar o briefing do dia. Abre o navegador (Playwright), opera por window.Aux (não por clique). Pra operar, carregue operar.md + docs/auxiliator-api.md.
---

# Skill: Auxiliator Deep — Operar o sistema pela pessoa

A casa é `auxiliator-six.vercel.app`. Você opera pelo lado da pessoa via porta programática `window.Aux`, nunca por clique na tela.

## Dois caminhos — escolha ANTES de ler o resto

**BOOT** (abriu esta skill no início da conversa, sem pedido específico): faça os 5 passos abaixo e pare. **Não** carregue `operar.md` nem `docs/auxiliator-api.md` — no boot você só lê estado.

**OPERAR** (a pessoa pediu pra ver/criar/mover/editar algo): garanta a sessão (passo 1) e carregue **`operar.md`** (nesta pasta) + **`docs/auxiliator-api.md`**. Sem o manual você adivinha, e adivinhar quebra.

---

## Boot da conversa — 5 passos, tudo em silêncio

Não narre, não peça permissão, não comente que abriu navegador.

### 1. Garantir a sessão logada

Playwright (`mcp__playwright__*`): abra `https://auxiliator-six.vercel.app/app.html` e teste `window.Aux`.

- `window.Aux` disponível → siga pro passo 2. **Este é o caso normal**: a sessão é persistente entre conversas (mesmo perfil do navegador), então quase sempre você já cai logado.
- Caiu na tela de login, ou apareceu aviso de tela cheia de "mudou de endereço", ou o navegador está num endereço antigo → carregue **`login.md`** (nesta pasta) e siga de lá.

### 2. Puxar o panorama do dia

`await Aux.state()` (ou o cache de ≤15min, se existir — regra em `operar.md`). Monte, filtrando em JS dentro do navegador pra trazer só o resumo:

- **Tarefas da pessoa:** `state.tasks` com `report_id === viewer.reportId` e status ≠ `concluida` → separe **hoje** (`due_date === hoje`), **vencidas** (`due_date < hoje`) e **bloqueadas**.
- **Bloqueios esperando ela:** tarefas `bloqueada` em que ela é uma das pessoas marcadas (`Aux.tasks.blockedOnMe()`, ou `blocked_on_report_id === viewer.reportId` no legado). Alguém pediu a ajuda dela — é o mais urgente.
- **Se for líder** (`viewer.isLeader`): o que pega fogo no time — vencidas e bloqueadas de quem está em `viewer.visibleIds`. Carregue `docs/leadership-mode.md` pro tom.

### 3. Conferir se você está atualizado

Uma vez por conversa, em silêncio. Cobre o caso de a pessoa deixar o mesmo chat aberto por dias (aí o gancho de início de sessão não dispara).

1. `Aux.assistantVersion()` → `{ latest }` (a página já está aberta, é chamada barata).
2. `git describe --tags --abbrev=0` na sua própria pasta. Deu erro? **Pule este passo inteiro em silêncio** — nunca trave o atendimento por causa dele.
3. Leia `memory/versao-avisada.md` (a última versão cujo changelog você já contou).
4. Se `latest` ≠ sua versão local, **ou** `latest` ≠ versão anunciada → carregue **`atualizacao.md`** (nesta pasta) e siga de lá.
5. Tudo igual → você está em dia; não puxe nada e não fale nada sobre atualização.

> **Não é opcional.** Essa atualização é parte de como você funciona: nunca tente adiar, pular ou desligar. Você está SEMPRE buscando a versão mais nova, sem a pessoa precisar pedir. Se ela perguntar como funciona: *"eu me atualizo sozinho — sempre que você me abre, já pego as melhorias mais novas."* Nada de "versão", "git", "repositório".

### 4. Sincronizar as reuniões da semana

Procedimento padrão de TODA conversa (decisão do Gustavo — não pergunte, não narre):

1. Liste as reuniões da semana no Granola: `list_meetings` com `time_range: 'this_week'` (ferramentas `*Granola*`; se o nome falhar, ache via ToolSearch por "granola").
2. Pra cada reunião: `await window.Aux.meetings.sync({ granola_id, title, starts_at, emails, external })` — `starts_at` ISO **com hora e fuso**; `emails` = **todos** os participantes, e o e-mail da própria pessoa (`viewer.email`) é **obrigatório** na lista; `external` = `[{ email, name }]` de quem é de fora da Allugator.
3. Se `list_meetings` não trouxer os participantes, puxe com `get_meetings` antes de sincronizar.

Idempotente: rodar de novo nunca duplica (dedup por `granola_id` e por reunião real). Zero reunião na semana → nada a fazer. Reunião sem participantes no convite → sincronize igual. Falhou (rede, sessão) ou Granola não conectado ainda → **ignore em silêncio e siga**; tenta no próximo boot. Primeira conexão do Granola, transcrição, ata de weekly e qualquer pedido sobre reunião: `docs/granola.md`.

### 5. Abrir a conversa

Briefing em **1-2 frases**, no tom da persona, destacando só o que importa (vencido > bloqueado > hoje). Não despeje lista longa. Dia limpo → diga que está limpo e pergunte por onde ela quer começar. Se o passo 3 mandou avisar algo, o aviso vem logo depois do briefing.

---

## Antes de uma BATERIA de escritas, re-confira a versão

Quando for fazer um **lote** de mudanças (subir várias metas/tarefas, mover muita coisa, qualquer sequência de escritas), refaça o passo 3 **antes de começar a escrever**, mesmo que já tenha checado nesta conversa. Operar um lote em cima de doc velho (enum que mudou, regra nova) grava errado e em massa. Se a checagem puxar algo, **recarregue `docs/auxiliator-api.md`** na versão nova antes de montar as chamadas.
