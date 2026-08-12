---
name: _como-eu-opero
type: painel
description: PORTA DE ENTRADA do meu modo de operar — o manual e o corpo das skills, que saíram do repo em 05/08/2026 e passaram a morar aqui
atualizado: 2026-08-05
---

> [!tip] O que é esta pasta
> Aqui vive **como eu trabalho**: o manual de operação e o corpo das skills. Antes isto estava em `docs/` e dentro de `.claude/skills/`, no repo. Em 05/08/2026 tudo veio pra cá pra ficar num lugar só, legível e editável no Obsidian.

## O que ficou fora daqui, e por quê

Três coisas **não podem** sair do lugar, porque é de lá que o Claude Code me carrega:

| Fica onde está | Por quê |
|---|---|
| `CLAUDE.md` na raiz do repo | Carregado automaticamente em toda conversa. É a alma: identidade, persona, princípios, autonomia, roteamento de skill e linguagem proibida. Só o que precisa estar no boot |
| `.claude/skills/<nome>/SKILL.md` | O gatilho da skill vive no frontmatter desses arquivos. Cada um virou um cartão de poucas linhas que manda ler o arquivo daqui |
| `memory/MEMORY.md`, `memory/profile.md`, `memory/versao-avisada.md` | Citados literalmente pelo `CLAUDE.md` e pelas skills. Nome fixo, ver [[_convencoes]] |

Também ficaram no repo as skills `canvas-design` e `frontend-design`: elas carregam ~90 arquivos de fonte amarrados no caminho relativo, e não são meu modo de operar, são ferramenta genérica de design.

## O manual

| Arquivo | Quando eu leio |
|---|---|
| [[seguranca-e-confirmacao]] | Antes de ação que pode ser drástica ou irreversível |
| [[criar-tarefas]] | **Sempre** que for criar tarefa no Auxiliator |
| [[escrever-como-humano]] | Antes de redigir texto que sai com o nome do Rei |
| [[exemplos-de-tom]] | Pra calibrar a fala em cada persona |
| [[filtro-de-relevancia]] | Ao varrer conversa/Slack/e-mail pra extrair tarefa |
| [[modo-lideranca]] | Ao atuar sabendo se a pessoa é líder ou liderada |
| [[modo-avancado]] | Pra decidir se recomendo subir o modo de pensamento |
| [[o-que-sei-fazer]] | Quando perguntam o que eu consigo fazer, e no onboarding |
| [[granola-reunioes]] | Qualquer pedido sobre reunião ou call |

Fora desta pasta, mas do mesmo naipe: [[api-do-auxiliator]] (em `70-auxiliator/`) e [[glossario-de-areas]] (em `40-allu/`).

## O corpo das skills

`skills/` guarda o conteúdo de cada uma. O `SKILL.md` no repo é só o cartão que aponta pra cá.

| Skill | Corpo | Partes |
|---|---|---|
| auxiliator-deep | [[auxiliator-deep]] | [[auxiliator-deep-operar]] · [[auxiliator-deep-login]] · [[auxiliator-deep-atualizacao]] |
| modo-especialista | [[modo-especialista]] | — |
| council | [[council]] | — |
| onboarding | [[onboarding]] | o gabarito do `profile.md` está no fim do arquivo |
| subir-metas | [[subir-metas]] | — |
| typeracer | [[typeracer]] | motor em `.claude/skills/typeracer/motor.js`; só treino solo |

## Se eu mexer aqui

Esta pasta **está no controle de versão** (é a exceção no `.gitignore`, o resto de `memory/` fica fora). Motivo: é o meu manual, e é dele que sai a atualização que outra máquina puxa do GitHub. Mudou algo aqui? Commite, senão a próxima versão sai sem a mudança.

Se você renomear um arquivo daqui, conserte também o `CLAUDE.md` e o `SKILL.md` que apontam pra ele — aqueles usam caminho, não link, justamente porque são lidos de fora do cofre.
