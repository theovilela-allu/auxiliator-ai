---
name: _convencoes
type: referencia
description: Como esta memória é organizada — pastas, nomes, frontmatter, ligação e como um fato citado se defende. Normativo: nota que contraria isto está errada
atualizado: 2026-09-01
---

> [!abstract] Pra que este arquivo existe
> Reorganizado em 2026-08-05 pra virar um vault de Obsidian. Antes, 36 dos 55 links estavam quebrados: eu linkava pelo nome interno da anotação (`[[project-projeto-estagio]]`) e o Obsidian resolve pelo **nome do arquivo** (`project_projeto_estagio.md`). A regra que conserta isso pra sempre está na seção 3.

## 1. O que esta memória é, e o que não é

Guarda **o que não se deriva do código nem do git**: quem o Rei é, como ele quer ser atendido, decisões fechadas (e por quê), estado de projeto, dado da Allu que custou caro descobrir. Não guarda estrutura de código, histórico de commit, nem o que o CLAUDE.md já diz.

**Fonte única:** cada fato mora em exatamente um arquivo. Todo o resto linka, nunca copia.

## 2. Pastas

| Pasta | O que entra |
|---|---|
| raiz | Só os 3 arquivos de nome fixo (seção 4) |
| `00-guia` | Meta-documentação. Este arquivo |
| `05-como-eu-opero` | **Meu manual de operação e o corpo das skills.** Saiu do repo (`docs/` e `.claude/skills/`) em 05/08/2026. É a **única pasta versionada** do cofre, junto de `00-guia` — ver [[_como-eu-opero]] |
| `10-o-rei` | Quem o Rei é e o contexto de acesso dele |
| `15-pessoas` | Uma nota por colega recorrente (férias, o que responde, como falar com ele) |
| `20-como-trabalhar` | Regras que ele me deu sobre como eu opero (estilo, autonomia, limites) |
| `30-compras` | Sistema de Compras: o projeto grande. `historico/` guarda o que aconteceu por data |
| `40-allu` | Dado e processo da Allugator que não é do sistema de compras |
| `50-reunioes` | Ata de reunião, uma por data |
| `60-visual` | Deck, identidade visual e as regras de layout que já me morderam |
| `70-auxiliator` | O Auxiliator em si (o sistema, não o que está dentro dele) |
| `80-ferramentas` | Ferramenta externa: como usar, onde mora |
| `99-arquivo` | Superado. Fica por histórico, sai das buscas. **Nada é deletado** |

Numeração com salto de 10 pra encaixar domínio novo sem renumerar tudo.

## 3. Nomes de arquivo — a regra que não pode quebrar

**O nome do arquivo é o alvo do link.** `name:` no frontmatter tem que ser igual ao nome do arquivo sem `.md`, e é assim que se linka: `[[estilo-de-escrita]]`.

- kebab-case, sem acento, sem `_`, sem prefixo de tipo (o tipo mora no frontmatter e na pasta).
- Nota datada começa pela data ISO: `2026-08-03-provas-em-producao`.
- Painel/porta de entrada de um domínio começa com `_`: `_sistema-de-compras`. Digitar `_` no Quick Switcher lista todos.
- Renomeou? Ponha o nome velho em `aliases:` — link antigo continua resolvendo.

## 4. Os três arquivos de nome fixo

Estes são citados literalmente no `CLAUDE.md` e nas skills. **Nunca renomear, nunca mover, nunca deixar o Obsidian renomear:**

- `MEMORY.md` — o índice, lido no início de toda conversa. Uma linha por anotação, máx ~120 caracteres.
- `profile.md` — quem é a pessoa, persona ativa, integrações.
- `versao-avisada.md` — última versão cujo changelog eu já contei.

## 5. Frontmatter

```yaml
name:         # igual ao nome do arquivo, sem .md
type:         # vocabulário fechado, abaixo
description:  # uma linha — é o que me faz decidir se abro ou não
atualizado:   # YYYY-MM-DD
status:       # opcional: em-andamento | bloqueado | entregue | arquivado
aliases:      # opcional: nomes antigos, pra link velho não quebrar
```

`type` fechado: `user` · `feedback` · `project` · `reference` / `referencia` · `note` · `painel`.

A `description` é o campo mais importante do arquivo. Ela é o que aparece no índice e o que decide se vale gastar uma leitura. Escreva ela como se fosse a única coisa que eu vou ler.

## 6. Regras de ligação

1. Toda nota de frente do compras linka o painel [[_sistema-de-compras]].
2. Toda nota datada de histórico linka o painel do domínio dela.
3. Toda regra de comportamento (`type: feedback`) linka a nota do trabalho que a originou, e vice-versa.
4. Nota arquivada linka a que a substituiu.

## 7. Fato que veio da conversa anda com a FRASE dele

**Fato que ele disse mora na nota junto da citação, em itálico e entre aspas, com a data.** Não é
enfeite: é o que faz a nota se defender de quem chega depois.

Aconteceu em 01/09/2026, e foi por pouco. Uma nota dizia que a planilha do DP e o texto da política
chegavam em 02/09. Eu não tinha ouvido data nenhuma — aquilo veio de outra conversa — e ia apagar,
achando que era palpite de quem escreveu. O que segurou foi a frase dele logo ao lado: *"esses dois
que dependem de mim eu só vou conseguir entregar amanhã."* Com a citação, o fato se provou sozinho.
Sem ela, o palpite de um teria virado o palpite do outro.

Daí as duas metades da regra:

- **Quem escreve** põe a frase entre aspas ao lado do fato, com a data. Uma linha de citação custa
  nada e vale por uma conversa inteira.
- **Quem chega depois NÃO sobrescreve fato citado — pergunta.** Vale pra outro agente e vale pra mim
  daqui a uma semana, que é o caso mais comum. Fato SEM citação também não se apaga no reflexo:
  confere primeiro, e se não der pra confirmar, pergunta a ele.

Isto vale pra qualquer nota do vault. Ver [[trabalhar-junto-de-outro-agente]] pra o resto da régua
de quando tem mais de um agente escrevendo aqui ao mesmo tempo.

## 8. Ao salvar coisa nova

1. **Já existe?** Duplicata é o pior inimigo. Procure antes.
2. Escolha a pasta pelo domínio, não pelo tipo.
3. Nome = slug de link. `description` de uma linha que se sustenta sozinha.
4. Uma linha nova no `MEMORY.md` com o caminho relativo.
5. Se superou uma nota antiga, mova a antiga pra `99-arquivo` com `status: arquivado` e linke a nova. Não delete.
