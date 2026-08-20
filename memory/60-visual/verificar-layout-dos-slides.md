---
name: verificar-layout-dos-slides
type: feedback
description: Sempre renderizar slides em imagem e conferir posição/distribuição com o olho antes de entregar um deck
atualizado: 2026-08-05
aliases:
  - feedback-verificar-layout-slides
---

O Rei apontou (2026-07-06) que os elementos dos slides às vezes ficam mal distribuídos/deslocados (ex.: "os quadrados muito pra direita"), e que já viu isso em outras apresentações. Pediu pra corrigir **pra sempre**.

**Why:** eu vinha montando os decks (python-pptx) posicionando shapes por coordenada fixa **sem nunca ver o resultado renderizado**. Texto que quebra em mais linhas que a caixa comporta, ou posições assimétricas, passam batido porque eu não olho o slide pronto.

**How to apply:** SEMPRE que gerar/editar um deck .pptx, antes de entregar:
1. Renderize cada slide em PNG e **olhe** (via Read na imagem). No Windows, com PowerPoint instalado, exportar por COM:
   ```powershell
   $pp = New-Object -ComObject PowerPoint.Application
   $pres = $pp.Presentations.Open("<abs.pptx>", $true, $false, $false)
   $pres.Export("<pasta_saida>", "PNG", 1400, 788)
   $pres.Close(); $pp.Quit()
   ```
   (fechar o PowerPoint antes: `Get-Process POWERPNT | Stop-Process -Force`).
2. Confira: margem esquerda ≈ direita, cards alinhados à mesma grade, texto sem vazar/encostar na borda ou no card de baixo, nada sobreposto, badges de número centrados.
3. Só entregar depois de a imagem estar boa. Se algo estiver torto, ajustar as coordenadas e re-renderizar.

Grade padrão que fica centrada em 13,333 x 7,5: margem 0,7 de cada lado; 2 colunas = cw 5,75 + gap 0,4 (0,7 + 5,75 + 0,4 + 5,75 = 12,6; sobra 0,73 à direita). Relacionado: [[identidade-visual-allu]], [[python-e-pptx]].
