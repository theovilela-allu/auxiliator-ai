# Sonda: a tarefa agendada dispara com a maquina TRANCADA (Win+L)?
#
# Ele avisou em 03/09/2026 que sempre vai deixar a maquina no Win+L quando o
# trabalho da madrugada rodar. Isso e a viga do agendamento inteiro, entao nao
# basta eu afirmar que funciona: tem que ter medida.
#
# Roda de minuto em minuto e anota, a cada disparo: a hora, se a tela estava
# trancada, e se o terminal que ele abre enxerga a funcao `claude` (que e o que
# faz a sessao nascer com a flag e com o laco do bastao).
#
# Como saber que esta trancado: com a tela de bloqueio na frente, o Windows
# mantem o LogonUI.exe de pe. Sem cadeado, ele nao existe.

$ErrorActionPreference = 'Continue'
$log = Join-Path $env:USERPROFILE '.claude\prova-do-cadeado.log'

$trancado = [bool](Get-Process -Name 'LogonUI' -ErrorAction SilentlyContinue)

# O terminal filho enxerga a funcao `claude`? (mesmo caminho do script de verdade)
$marca = Join-Path $env:TEMP ('prova-cadeado-{0}.txt' -f (Get-Random))
$filho = Join-Path $env:TEMP ('prova-cadeado-{0}.ps1' -f (Get-Random))
@"
`$c = Get-Command claude -ErrorAction SilentlyContinue
if (`$c) { "claude=`$(`$c.CommandType)" | Out-File -LiteralPath '$marca' -Encoding utf8 }
else     { "claude=AUSENTE"             | Out-File -LiteralPath '$marca' -Encoding utf8 }
"@ | Out-File -LiteralPath $filho -Encoding utf8

try {
    Start-Process powershell.exe -ArgumentList '-ExecutionPolicy','Bypass','-File',$filho `
                 -WindowStyle Hidden -Wait -ErrorAction Stop
    $achou = if (Test-Path $marca) { (Get-Content -LiteralPath $marca -Raw).Trim() } else { 'claude=SEM RESPOSTA' }
} catch {
    $achou = "FALHOU ao abrir terminal: $($_.Exception.Message)"
}

$linha = '{0}  trancado={1,-5}  {2}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $trancado, $achou
Add-Content -Path $log -Value $linha -Encoding utf8
