# Abre o code review de fechamento, agendado por ele pra 23:45 de 03/09/2026.
#
# Quem dispara isto e a tarefa agendada do Windows "AuxiliatorReviewDeFechamento".
# O que ele faz: abre um terminal NOVO e visivel, carrega o profile dele (pra a funcao
# `claude` do laco de passagem de bastao existir) e entra com a mensagem de abertura do
# arquivo .prompt.txt. Como o profile e carregado, valem duas coisas de graca: a flag
# --dangerously-skip-permissions e o laco que relanca a sessao se ela passar o bastao aos
# 500k. Desenho da corrente: memory/00-guia/passagem-de-bastao.md
#
# -Agora  roda na hora, sem esperar o agendamento (pra testar).
# -Seco   so mostra o que faria.

param(
    [switch]$Agora,
    [switch]$Seco,
    # Modo do reinicio das 5h: so abre sessao se ainda houver review pra fazer.
    # Se a bateria ja fechou, nao abre nada e DESLIGA a maquina, que e o pedido
    # dele ("quero que o computador esteja desligado pra dar tempo dele resfriar
    # quando eu chegar"). O desligamento passa pelas cinco travas do desligar.ps1,
    # entao ele NAO acontece se ele estiver mexendo na maquina.
    [switch]$SeNecessario
)

$ErrorActionPreference = 'Stop'

$projeto = 'C:\Users\Allu\Desktop\auxiliator-ai'
$prompt  = Join-Path $PSScriptRoot 'review-de-fechamento.prompt.txt'
$log     = Join-Path $env:USERPROFILE '.claude\review-de-fechamento.log'

function Registra($texto) {
    $linha = "{0}  {1}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $texto
    Write-Output $linha
    try { Add-Content -Path $log -Value $linha -Encoding utf8 } catch { }
}

if (-not (Test-Path $prompt)) {
    Registra "ABORTADO: nao achei a mensagem de abertura em $prompt"
    exit 1
}
if (-not (Test-Path $projeto)) {
    Registra "ABORTADO: nao achei o projeto em $projeto"
    exit 1
}

# -SeNecessario: o reinicio das 5h. Se a bateria ja fechou, nao abre nada e apaga a luz.
# O sinal de "fechou" e o `status: concluido` no cabecalho do caderno de andamento, que o
# briefing manda a sessao escrever quando encerra a bateria.
if ($SeNecessario) {
    $andamento = Join-Path $projeto 'memory\30-compras\review-de-fechamento-andamento.md'
    $concluido = $false
    if (Test-Path $andamento) {
        $texto = Get-Content -LiteralPath $andamento -Raw -Encoding UTF8
        if ($texto -match '(?m)^\s*status:\s*concluido\s*$') { $concluido = $true }
    } else {
        Registra "AVISO: nao achei o caderno de andamento em $andamento"
    }

    if ($concluido) {
        Registra "o review ja fechou (status: concluido no caderno). Nao abro sessao: vou apagar a luz."
        $desligar = Join-Path $PSScriptRoot 'desligar.ps1'
        if (-not (Test-Path $desligar)) {
            Registra "ABORTADO: queria desligar mas nao achei o desligar.ps1"
            exit 1
        }
        if ($Seco) {
            Registra "SECO: chamaria $desligar -Terminei"
            & $desligar -Terminei -Seco
            exit 0
        }
        # Anuncia e marca pronto: assim este script entra nas contas das cinco travas
        # em vez de atropelar elas. Se ele estiver mexendo na maquina, nao desliga.
        & $desligar -Cheguei
        & $desligar -Terminei
        Registra "desligamento pedido (quem decide sao as travas do desligar.ps1)"
        exit 0
    }

    Registra "o review NAO fechou ainda: sigo pro reinicio."
}

# Nao abre uma segunda sessao EM CIMA de outra que esteja mesmo trabalhando. Mas
# "processo existe" nao e o mesmo que "sessao viva": quando a cota de uso acaba, o
# claude fica aberto e parado em vez de fechar, e uma trava ingenua faria o reinicio
# das 5h nao acontecer, que e justamente a hora que ele mais quer. Entao o crivo e
# CPU: mede duas vezes com 15s de intervalo e so respeita quem consumiu processador.
# Duas fontes, porque uma so nao basta:
#   (a) claude.exe aberto POR ESTE script (a mensagem de abertura aparece na linha
#       de comando dele);
#   (b) qualquer agente ANUNCIADO como "trabalhando" com o PID vivo. Esta e a que
#       pega a sessao que ELE mesmo abriu na mao: o modo autonomo se anuncia no
#       comeco (desligar.ps1 -Cheguei), entao ela aparece aqui mesmo sem ter
#       nascido deste script. Sem isto, as 23:45 nasceria uma segunda sessao em
#       cima da dele.
$pids = @()

$pids += @(Get-CimInstance Win32_Process -Filter "Name='claude.exe'" -ErrorAction SilentlyContinue |
    Where-Object { $_.CommandLine -and $_.CommandLine -like '*review-de-fechamento*' } |
    ForEach-Object { [int]$_.ProcessId })

$casaDosAgentes = Join-Path $env:USERPROFILE '.claude\agentes'
if (Test-Path $casaDosAgentes) {
    $pids += @(Get-ChildItem $casaDosAgentes -Filter '*.json' -ErrorAction SilentlyContinue | ForEach-Object {
        try { $d = Get-Content $_.FullName -Raw -Encoding UTF8 | ConvertFrom-Json } catch { return }
        if ($d.Estado -eq 'trabalhando' -and (Get-Process -Id $d.Pid -ErrorAction SilentlyContinue)) {
            [int]$d.Pid
        }
    })
}

# Eu nao conto contra mim mesmo, nem conto duas vezes.
$pids = @($pids | Where-Object { $_ -and $_ -ne $PID } | Sort-Object -Unique)

if ($pids.Count -gt 0) {
    Registra "achei $($pids.Count) sessao(oes) deste review (PID $($pids -join ', ')). Medindo se estao trabalhando..."

    function TempoDeCpu($listaPids) {
        $total = 0
        foreach ($umPid in $listaPids) {
            try { $total += (Get-Process -Id $umPid -ErrorAction Stop).TotalProcessorTime.TotalSeconds } catch { }
        }
        return $total
    }

    $antes = TempoDeCpu $pids
    Start-Sleep -Seconds 15
    $depois = TempoDeCpu $pids
    $gasto = [math]::Round($depois - $antes, 2)

    if ($gasto -gt 0.5) {
        Registra "NADA FEITO: a sessao anterior esta viva e trabalhando ($gasto s de CPU em 15 s)"
        exit 0
    }
    Registra "a sessao anterior esta PARADA ($gasto s de CPU em 15 s): provavelmente a cota acabou. Abrindo a nova por cima."
}

# O terminal de dentro le a mensagem do arquivo, entao nada de aspas dentro de aspas.
$comando = "Set-Location '$projeto'; " +
           "`$msg = Get-Content -LiteralPath '$prompt' -Raw -Encoding UTF8; " +
           "claude `$msg"

if ($Seco) {
    Registra "SECO: abriria um terminal com -> $comando"
    exit 0
}

Registra "abrindo o terminal do review de fechamento"
Start-Process -FilePath 'powershell.exe' `
              -ArgumentList '-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', $comando `
              -WorkingDirectory $projeto `
              -WindowStyle Normal
Registra "terminal aberto"

if ($Agora) { Registra "(rodado na mao com -Agora)" }
