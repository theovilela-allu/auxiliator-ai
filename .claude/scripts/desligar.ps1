<#
  desligar.ps1 - o ULTIMO agente autonomo apaga a luz (03/09/2026)

  Pedido dele: "poe alguma coisa pra o agente se auto desligar quando estiver no
  autonomo e acabar o trabalho, e ai e bom que ele tenha algum modo de checar se
  tem mais algum agente trabalhando, pra de modo que: o ultimo agente, ao acabar
  o que ele tem pra fazer, desligue o computador."

  A IDEIA. Cada sessao autonoma se ANUNCIA quando comeca e se MARCA COMO PRONTA
  quando esvazia a fila. Quem termina olha em volta: se ainda houver agente
  trabalhando, ele so sai de fininho; se ele for o ultimo, desliga a maquina.

  POR QUE NAO DA PRA OLHAR SO OS PROCESSOS. Uma sessao do Claude Code nao morre
  quando acaba o trabalho: ela fica de pe esperando alguem falar. Entao "existe
  claude.exe vivo" nao responde "alguem ainda esta trabalhando". Por isso a
  presenca e DECLARADA, e o processo serve so pra saber se a declaracao ainda
  vale (PID morto = declaracao velha, ignora).

  AS CINCO TRAVAS antes de desligar, e todas tem que passar:
    1. Quem chama ja se marcou como pronto.
    2. Nenhum outro agente ANUNCIADO esta "trabalhando" com o PID vivo.
    3. Nenhum claude.exe vivo SEM anuncio. Sessao nao anunciada e, quase sempre,
       gente conversando: nao se desliga a maquina de quem esta usando.
    4. O teclado e o mouse estao parados ha pelo menos 15 minutos.
    5. Contagem regressiva de 120 s, cancelavel. Qualquer sessao que nasca nesse
       meio tempo derruba a contagem sozinha, porque -Cheguei comeca cancelando.

  USO (o corpo do modo autonomo chama os dois primeiros):
    desligar.ps1 -Cheguei     no inicio da sessao autonoma; cancela desligamento pendente
    desligar.ps1 -Terminei    quando a fila esvaziou; desliga SE for o ultimo
    desligar.ps1 -Estado      quem esta anunciado, em que estado, e o que travaria
    desligar.ps1 -Cancelar    derruba a contagem regressiva
    desligar.ps1 -Terminei -Seco   diz o que faria, sem desligar
#>
[CmdletBinding()]
param(
  [switch]$Cheguei,
  [switch]$Terminei,
  [switch]$Estado,
  [switch]$Cancelar,
  [switch]$Seco,
  [int]$OciosoMin = 15,
  [int]$SegundosDeAviso = 120
)

$ErrorActionPreference = 'Stop'
$Base   = Join-Path $env:USERPROFILE '.claude'
$Casa   = Join-Path $Base 'agentes'
$Log    = Join-Path $Base 'desligar.log'
if (-not (Test-Path $Casa)) { New-Item -ItemType Directory -Path $Casa -Force | Out-Null }

function Anota($t) {
  $l = (Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + '  ' + $t
  Add-Content -Path $Log -Value $l -Encoding utf8
  Write-Output $l
}

# Sobe a arvore de processos ate achar o claude.exe dono desta sessao. E ele que
# representa o agente: o powershell que roda este script e neto dele e morre logo.
function ClaudeDono {
  $todos = @{}
  Get-CimInstance Win32_Process -Property ProcessId, ParentProcessId, Name | ForEach-Object { $todos[[int]$_.ProcessId] = $_ }
  $p = $PID; $voltas = 0
  while ($p -and $voltas -lt 20) {
    $proc = $todos[[int]$p]
    if (-not $proc) { break }
    if ($proc.Name -like 'claude*') { return [int]$proc.ProcessId }
    $p = [int]$proc.ParentProcessId; $voltas++
  }
  return $null
}

function Anunciados {
  Get-ChildItem $Casa -Filter '*.json' -ErrorAction SilentlyContinue | ForEach-Object {
    try { $d = Get-Content $_.FullName -Raw | ConvertFrom-Json } catch { return }
    $vivo = [bool](Get-Process -Id $d.Pid -ErrorAction SilentlyContinue)
    [pscustomobject]@{ Pid = $d.Pid; Estado = $d.Estado; Desde = $d.Desde; Quem = $d.Quem; Vivo = $vivo; Arquivo = $_.FullName }
  }
}

function OciosoSegundos {
  $sig = @"
using System;
using System.Runtime.InteropServices;
public class Ocio {
  [StructLayout(LayoutKind.Sequential)]
  struct LASTINPUTINFO { public uint cbSize; public uint dwTime; }
  [DllImport("user32.dll")] static extern bool GetLastInputInfo(ref LASTINPUTINFO plii);
  [DllImport("kernel32.dll")] static extern uint GetTickCount();
  public static uint Segundos() {
    LASTINPUTINFO i = new LASTINPUTINFO();
    i.cbSize = (uint)Marshal.SizeOf(i);
    if (!GetLastInputInfo(ref i)) return 0;
    return (GetTickCount() - i.dwTime) / 1000;
  }
}
"@
  if (-not ('Ocio' -as [type])) { Add-Type -TypeDefinition $sig -Language CSharp }
  return [int][Ocio]::Segundos()
}

# ARMADILHA: `shutdown /a` sem nada pendente escreve no canal de ERRO ("o sistema
# nao estava sendo desligado", 1116). Chamado direto, o PowerShell embrulha isso
# num NativeCommandError e, com ErrorActionPreference = Stop, aborta o script
# inteiro. Por isso vai pelo cmd, com a saida engolida: aqui "nao havia nada pra
# cancelar" e resultado normal, nao erro.
function CancelaContagem {
  cmd.exe /c "shutdown /a >nul 2>&1"
  if ($LASTEXITCODE -eq 0) { Anota 'contagem regressiva CANCELADA' }
  $global:LASTEXITCODE = 0   # "nada pendente" nao e falha deste script
}

# ---------------------------------------------------------------- Cancelar
if ($Cancelar) { CancelaContagem; return }

# ---------------------------------------------------------------- Cheguei
if ($Cheguei) {
  CancelaContagem   # sessao nova derruba desligamento pendente: e a rede da corrente do bastao
  $meu = ClaudeDono
  if (-not $meu) { Anota 'nao achei o claude.exe dono; nao me anuncio'; return }
  $arq = Join-Path $Casa "$meu.json"
  $d = [ordered]@{ Pid = $meu; Estado = 'trabalhando'; Desde = (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'); Quem = $env:CLAUDE_PROJECT_DIR }
  Set-Content -Path $arq -Value ($d | ConvertTo-Json -Compress) -Encoding utf8
  Anota "anunciado: agente $meu trabalhando"
  return
}

# ---------------------------------------------------------------- Estado
if ($Estado) {
  $lista = @(Anunciados)
  if ($lista.Count -eq 0) { Anota 'nenhum agente anunciado' }
  foreach ($a in $lista) { Anota ("  agente {0}: {1} | desde {2} | processo {3}" -f $a.Pid, $a.Estado, $a.Desde, $(if ($a.Vivo) { 'VIVO' } else { 'morto (anuncio velho)' })) }
  $claudes = @(Get-Process -Name claude -ErrorAction SilentlyContinue)
  $semAnuncio = @($claudes | Where-Object { $_.Id -notin ($lista | ForEach-Object { $_.Pid }) })
  Anota ("claude.exe vivos: {0} | sem anuncio: {1}" -f $claudes.Count, $semAnuncio.Count)
  Anota ("teclado/mouse parados ha {0} s (trava se < {1} s)" -f (OciosoSegundos), ($OciosoMin * 60))
  return
}

# ---------------------------------------------------------------- Terminei
if (-not $Terminei) { Anota 'nada a fazer: use -Cheguei, -Terminei, -Estado ou -Cancelar'; return }

$meu = ClaudeDono
if (-not $meu) { Anota 'nao achei o claude.exe dono; nao vou desligar as cegas'; return }

$arq = Join-Path $Casa "$meu.json"
$d = if (Test-Path $arq) { Get-Content $arq -Raw | ConvertFrom-Json } else { $null }
$novo = [ordered]@{
  Pid = $meu; Estado = 'pronto'
  Desde = $(if ($d) { $d.Desde } else { (Get-Date -Format 'yyyy-MM-dd HH:mm:ss') })
  Quem = $(if ($d) { $d.Quem } else { $env:CLAUDE_PROJECT_DIR })
}
Set-Content -Path $arq -Value ($novo | ConvertTo-Json -Compress) -Encoding utf8
Anota "agente $meu marcado como PRONTO"

# --- trava 2: outro agente anunciado ainda trabalhando?
$outros = @(Anunciados | Where-Object { $_.Pid -ne $meu -and $_.Vivo -and $_.Estado -eq 'trabalhando' })
if ($outros.Count -gt 0) {
  Anota ("NAO desligo: ainda trabalham -> " + (($outros | ForEach-Object { $_.Pid }) -join ', '))
  return
}

# --- trava 3: claude.exe vivo sem anuncio = provavelmente gente conversando
$anunciadosVivos = @(Anunciados | Where-Object { $_.Vivo } | ForEach-Object { $_.Pid })
$semAnuncio = @(Get-Process -Name claude -ErrorAction SilentlyContinue | Where-Object { $_.Id -notin $anunciadosVivos })
if ($semAnuncio.Count -gt 0) {
  Anota ("NAO desligo: ha claude.exe sem anuncio (" + (($semAnuncio | ForEach-Object { $_.Id }) -join ', ') + "). Sessao nao anunciada e alguem usando a maquina.")
  return
}

# --- trava 4: a pessoa mexeu no computador ha pouco?
$ocio = OciosoSegundos
if ($ocio -lt ($OciosoMin * 60)) {
  Anota ("NAO desligo: teclado/mouse mexidos ha {0} s (preciso de {1} s parados)" -f $ocio, ($OciosoMin * 60))
  return
}

# --- trava 5: aviso e contagem regressiva
if ($Seco) { Anota "SECO: passaria em todas as travas e desligaria em $SegundosDeAviso s"; return }
$msg = "Ultimo agente terminou. Desligando em $SegundosDeAviso s. Para cancelar: shutdown /a"
Anota "TODAS AS TRAVAS PASSARAM. $msg"
cmd.exe /c "shutdown /s /t $SegundosDeAviso /c ""$msg"" >nul 2>&1"
if ($LASTEXITCODE -ne 0) { Anota "shutdown recusou (codigo $LASTEXITCODE)" } else { Anota 'contagem regressiva iniciada' }
