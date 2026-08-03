<#
=====================================================================
 install-bom-dia.ps1
 Instala uma tarefa agendada que, todo dia no horario escolhido, abre
 o Claude numa sessao NOVA e manda "bom dia". E o que faz o assessor
 acordar do zero, pegar as atualizacoes e dar o briefing do dia.

 COMO RODAR (uma vez, em cada PC):
   1. Leve a pasta do auxiliator (a que tem o CLAUDE.md) pro outro PC.
   2. Abra o PowerShell na pasta \scripts e rode:
        powershell -ExecutionPolicy Bypass -File .\install-bom-dia.ps1
   3. Pronto. Ele acha a pasta do projeto sozinho.

 OPCOES (todas opcionais):
   -WorkDir "C:\caminho\auxiliator"   pasta onde o claude roda
   -Time    "09:30"                    horario diario (padrao 11:00)
   -CloseAfter 5                       segundos ate a janela fechar sozinha
                                        (padrao 5; use 0 pra deixar aberta)
   -Headless                           roda escondido e salva num log
                                        (funciona ate com a tela travada)
   -TaskName "Meu nome"                nome da tarefa
   -Uninstall                          remove a tarefa

 PRE-REQUISITO: ter o Claude Code instalado (o comando 'claude' no PATH).
=====================================================================
#>
[CmdletBinding()]
param(
  [string]$WorkDir    = "",
  [string]$Time       = "11:00",
  [int]$CloseAfter    = 5,
  [string]$TaskName   = "Claude - Bom dia diario",
  [switch]$Headless,
  [switch]$Uninstall
)

$ErrorActionPreference = "Stop"

# ---- desinstalar e sair -------------------------------------------
if ($Uninstall) {
  try {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction Stop
    Write-Host "Removida a tarefa '$TaskName'." -ForegroundColor Green
  } catch {
    Write-Host "Nao havia tarefa '$TaskName' pra remover." -ForegroundColor Yellow
  }
  return
}

# ---- 1. onde estou / onde esta o projeto --------------------------
$here = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }

function Test-IsProject($p) { $p -and (Test-Path (Join-Path $p 'CLAUDE.md')) }

if (-not $WorkDir) {
  $WorkDir = @($here, (Split-Path $here -Parent), (Get-Location).Path) |
             Where-Object { Test-IsProject $_ } | Select-Object -First 1
  if (-not $WorkDir) { $WorkDir = $here }
}
$WorkDir = (Resolve-Path $WorkDir).Path

if (-not (Test-IsProject $WorkDir)) {
  Write-Warning "Nao achei CLAUDE.md em '$WorkDir'. Vou instalar mesmo assim, mas sem a pasta do auxiliator o 'bom dia' vira uma conversa generica. Use -WorkDir apontando pro projeto se precisar."
}

# ---- 2. claude esta instalado? ------------------------------------
if (-not (Get-Command claude -ErrorAction SilentlyContinue)) {
  Write-Warning "O comando 'claude' nao esta no PATH deste PC. Instale o Claude Code antes, senao a tarefa abre e nao faz nada. (Vou criar a tarefa mesmo assim.)"
}

# ---- 3. gerar o lancador ------------------------------------------
$launcher = Join-Path $here 'bom-dia.cmd'

if ($Headless) {
  $logExpr = "(Join-Path '$WorkDir' ('bom-dia-' + (Get-Date -Format yyyy-MM-dd) + '.txt'))"
  $cmd = @"
@echo off
REM Bom dia pro Claude (headless, salva log). Gerado por install-bom-dia.ps1.
cd /d "$WorkDir"
powershell -NoProfile -Command "claude -p 'bom dia' 2>&1 | Out-File -Append -Encoding utf8 $logExpr"
"@
} elseif ($CloseAfter -gt 0) {
  # abre o claude, manda "bom dia" e fecha a janela sozinho depois de N segundos
  $cmd = @"
@echo off
REM Bom dia pro Claude (sessao nova) e fecha em $CloseAfter s. Gerado por install-bom-dia.ps1.
powershell -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -Command "`$p = Start-Process claude -ArgumentList 'bom dia' -WorkingDirectory '$WorkDir' -PassThru; Start-Sleep -Seconds $CloseAfter; if (-not `$p.HasExited) { & taskkill /pid `$(`$p.Id) /t /f | Out-Null }"
"@
} else {
  # janela que fica aberta (CloseAfter 0)
  if (Get-Command wt.exe -ErrorAction SilentlyContinue) {
    $launchLine = 'start "" wt.exe -d "' + $WorkDir + '" cmd /k claude "bom dia"'
  } else {
    $launchLine = 'start "" cmd /k claude "bom dia"'
  }
  $cmd = @"
@echo off
REM Bom dia pro Claude (sessao nova, janela que fica aberta). Gerado por install-bom-dia.ps1.
cd /d "$WorkDir"
$launchLine
"@
}

Set-Content -Path $launcher -Value $cmd -Encoding ascii
Write-Host "Lancador criado: $launcher" -ForegroundColor Green

# ---- 4. registrar a tarefa ----------------------------------------
$action   = New-ScheduledTaskAction -Execute $launcher
$trigger  = New-ScheduledTaskTrigger -Daily -At ([DateTime]$Time)
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -MultipleInstances IgnoreNew
$me       = "$env:USERDOMAIN\$env:USERNAME"

if ($Headless) {
  $principal = New-ScheduledTaskPrincipal -UserId $me -LogonType S4U -RunLevel Limited
} else {
  $principal = New-ScheduledTaskPrincipal -UserId $me -LogonType Interactive -RunLevel Limited
}

Register-ScheduledTask -TaskName $TaskName `
  -Description "Todo dia as $Time manda 'bom dia' pro Claude (sessao nova)." `
  -Action $action -Trigger $trigger -Principal $principal -Settings $settings -Force | Out-Null

$modo = if ($Headless)          { "escondido (log em $WorkDir\bom-dia-AAAA-MM-DD.txt)" }
        elseif ($CloseAfter -gt 0) { "janela que abre e fecha sozinha em $CloseAfter s" }
        else                      { "janela que fica aberta" }

Write-Host ""
Write-Host "OK! Tarefa '$TaskName' criada." -ForegroundColor Green
Write-Host "Modo:    $modo"
Write-Host "Horario: todo dia as $Time"
Write-Host "Pasta:   $WorkDir"
Write-Host ""
Write-Host "Testar agora:   Start-ScheduledTask -TaskName `"$TaskName`""
Write-Host "Mudar horario:  rerode com   -Time `"09:30`""
Write-Host "Remover:        .\install-bom-dia.ps1 -Uninstall"
