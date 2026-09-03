---
name: copiar-antes-e-ler-antes-de-escrever
type: feedback
description: Em 03/09 eu zerei o tema e o settings.json do VS Code de uma vez, escrevendo o arquivo na mesma linha em que o lia — a regra que fecha essa porta, e como recuperei
atualizado: 2026-09-03
aliases:
  - nao-truncar-arquivo
---

> [!danger] O erro, com o nome dele
> Em 03/09/2026, trocando as cores do tema, eu escrevi isto:
>
> ```python
> io.open(p, "w").write(troca(io.open(p).read()))
> ```
>
> **O Python avalia `io.open(p, "w")` PRIMEIRO, e o modo `w` trunca o arquivo na hora.** Só depois
> ele avalia o argumento, que lê um arquivo já vazio e escreve string vazia. O tema do VS Code e o
> `settings.json` dele foram os dois pra **zero byte no mesmo laço**. Ele viu na hora: o fundo do
> editor escureceu, porque sem tema o VS Code cai no padrão.

## As duas regras que fecham a porta

1. **Ler, transformar, e só então escrever — em passos separados.** Nunca `open(p,"w")` na mesma
   expressão que a leitura. E antes de gravar, `assert` que o conteúdo lido não está vazio: se a
   leitura falhou, é melhor abortar que gravar nada por cima.
2. **Copiar antes de mexer.** Toda edição em arquivo de configuração dele (tema, `settings.json`,
   `keybindings.json`, `profile.ps1`, `statusline.cjs`) começa com uma cópia carimbada no
   scratchpad. Custa uma linha e me devolveu o dia.

Isso não é caso novo de permissão: nada disso está nas seis de [[o-que-eu-nao-posso-fazer]]. É
técnica. Mas apagar sem querer é o efeito que a proibição 1 existe pra evitar, então a régua vale
com o mesmo peso.

## Como eu recuperei, e isso vale guardar

- **`settings.json`**: eu tinha copiado antes de começar o azul. Voltou inteiro.
- **O tema não tinha cópia**, e a recuperação veio de um lugar que eu não conhecia: **o VS Code
  guarda o tema ativo inteiro no banco de estado dele**, em
  `~\AppData\Roaming\Code\User\globalStorage\state.vscdb` (SQLite), na tabela `ItemTable`, chave
  **`colorThemeData`**. Voltaram as **211 cores e as 16 regras de sintaxe**, com o nome certo.

  ```python
  con = sqlite3.connect("file:" + caminho + "?mode=ro", uri=True)
  d = json.loads(con.execute("select value from ItemTable where key='colorThemeData'").fetchone()[0])
  # d["colorMap"] -> colors ; d["themeTokenColors"] -> tokenColors
  ```

  **Ressalva que eu paguei:** o cache é da última vez que o VS Code CARREGOU o tema, então pode
  estar velho. O meu estava numa paleta anterior, e a estrutura voltou fiel mas as cores não. Foi
  preciso reaplicar a paleta chave por chave, e conferir o papel de cada uma — a primeira passada
  pôs o fundo do editor num tom de campo, e só o print mostrou.

## O que eu devo a ele quando isso acontece

Contar na hora, com o nome do erro e o que foi perdido, antes de ele perguntar. Ele descobriu o
sintoma sozinho (*"mas aí o fundo ficou escuro"*) enquanto eu ainda estava recuperando; o certo era
ele saber a causa pela minha boca primeiro.

Ligações: [[vscode-terminal-e-atalhos]] · [[testar-antes-de-dizer-pronto]] ·
[[o-que-eu-nao-posso-fazer]]
