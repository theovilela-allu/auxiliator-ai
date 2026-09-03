<#
  cadeado.ps1 - trancar a maquina e me deixar rodando (03/09/2026)

  Pedido dele: "quero bloquear meu computador e voce continuar rodando. Esse
  bloqueio deve ser desbloqueavel somente por senha."

  POR QUE NAO BASTA O Win+L. Travar a estacao NAO mata processo nenhum: eu
  continuo rodando normalmente. O risco nesta maquina e outro, e e por isso
  que este script existe:

    - E um NOTEBOOK com Modern Standby (S0 Ocioso com Baixo Consumo). Depois de
      ocioso, o Windows desce pro estado de baixa energia e estrangula o que
      esta rodando em segundo plano.
    - Fechar a tampa manda dormir, e power request nenhum segura isso.

  ENTAO O CADEADO TEM TRES PECAS, nesta ordem:

    1. VIGIA: um processo destacado que segura SetThreadExecutionState com
       ES_CONTINUOUS | ES_SYSTEM_REQUIRED. Enquanto ele viver, o Windows nao
       desce pro estado ocioso. Ele NAO segura a tela (ES_DISPLAY_REQUIRED fica
       de fora de proposito): a tela apaga, que e o que se quer numa maquina
       trancada. O vigia solta sozinho quando o claude.exe some por mais de 3
       minutos (a folga existe porque a corrente da passagem de bastao relanca o
       CLI em segundos), ou no teto de horas, o que vier primeiro.
    2. TAMPA: acao de fechar a tampa vira "nao fazer nada", nos dois modos
       (tomada e bateria). O valor antigo e guardado e devolvido no -Soltar.
    3. CADEADO: LockWorkStation. Volta so com a credencial da conta.

  AVISO HONESTO SOBRE "SOMENTE POR SENHA": quem manda no desbloqueio e o
  Windows. Se houver PIN ou reconhecimento facial cadastrados, eles tambem
  abrem. Pra ser senha e mais nada, e preciso tirar o Windows Hello em
  Configuracoes > Contas > Opcoes de entrada. Isso e escolha dele, nao minha.

  O QUE EU PERCO COM A TELA TRANCADA: captura de tela sai preta, entao qualquer
  conferencia de COR ou de layout por print para de valer enquanto o cadeado
  estiver de pe. O arquivo de sinal existe pra eu saber disso sozinho.

  USO:
    cadeado.ps1              tranca (arma o vigia, prende a tampa, tranca a tela)
    cadeado.ps1 -Armar       so arma o vigia e a tampa, sem trancar (pra provar)
    cadeado.ps1 -Soltar      desarma o vigia e devolve a tampa
    cadeado.ps1 -Estado      diz se esta armado, desde quando e o que segura
#>
[CmdletBinding()]
param(
  [switch]$Armar,
  [switch]$Soltar,
  [switch]$Estado,
  [int]$TetoHoras = 12
)

$ErrorActionPreference = 'Stop'
$Base    = Join-Path $env:USERPROFILE '.claude'
$Sinal   = Join-Path $Base 'cadeado.sinal'
$Log     = Join-Path $Base 'cadeado.log'
$LIDGUID = '5ca83367-6e45-459f-a27b-476b1d01c936'
$SUBBTN  = '4f971e89-eebd-4455-a8de-9e59040e7347'

function Anota($txt) {
  $linha = (Get-Date -Format 'yyyy-MM-dd HH:mm:ss') + '  ' + $txt
  Add-Content -Path $Log -Value $linha -Encoding utf8
  Write-Output $linha
}

function EsquemaAtivo {
  $s = (powercfg /getactivescheme) -join ' '
  if ($s -match '([0-9a-fA-F-]{36})') { return $Matches[1] }
  throw 'nao consegui descobrir o esquema de energia ativo'
}

# Le a acao da tampa direto do registro: independe do idioma do powercfg, que e
# o que quebra parse de saida traduzida.
#
# ARMADILHA QUE CUSTOU UMA RODADA EM 03/09: a acao da tampa e uma configuracao
# ESCONDIDA nesta maquina (Attributes = 1), entao ela nao aparece no
# `powercfg /query` e, enquanto ninguem mexer, NAO EXISTE chave de override no
# registro. O `powercfg -setacvalueindex` grava mesmo assim, mas apagar a chave
# depois exige administrador (Remove-Item da "Acesso ao Registro nao permitido").
# Ou seja: se eu ler so o override, eu leio nada, escrevo por cima e nao consigo
# desfazer. Por isso a leitura cai no PADRAO DE FABRICA
# (DefaultPowerSchemeValues) quando nao ha override, e o -Soltar devolve esse
# valor escrevendo, nao apagando.
function TampaAtual {
  $g = EsquemaAtivo
  $over = "HKLM:\SYSTEM\CurrentControlSet\Control\Power\User\PowerSchemes\$g\$SUBBTN\$LIDGUID"
  $fab  = "HKLM:\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\$SUBBTN\$LIDGUID\DefaultPowerSchemeValues\$g"
  $ac = $null; $dc = $null
  if (Test-Path $fab) {
    $p = Get-ItemProperty $fab
    $ac = $p.ACSettingIndex; $dc = $p.DCSettingIndex
  }
  if (Test-Path $over) {
    $p = Get-ItemProperty $over
    if ($null -ne $p.ACSettingIndex) { $ac = $p.ACSettingIndex }
    if ($null -ne $p.DCSettingIndex) { $dc = $p.DCSettingIndex }
  }
  if ($null -eq $ac -and $null -eq $dc) { return $null }
  [pscustomobject]@{ Esquema = $g; AC = [int]$ac; DC = [int]$dc }
}

function DefineTampa($ac, $dc) {
  $g = EsquemaAtivo
  powercfg -setacvalueindex $g $SUBBTN $LIDGUID $ac | Out-Null
  powercfg -setdcvalueindex $g $SUBBTN $LIDGUID $dc | Out-Null
  powercfg -setactive $g | Out-Null
}

function SinalCheio {
  if (-not (Test-Path $Sinal)) { return $false }
  return [bool]((Get-Content $Sinal -Raw).Trim())
}

# ---------------------------------------------------------------- Estado
if ($Estado) {
  if (SinalCheio) {
    $d = Get-Content $Sinal -Raw | ConvertFrom-Json
    $vivo = Get-Process -Id $d.VigiaPid -ErrorAction SilentlyContinue
    $situacao = if ($vivo) { 'VIVO' } else { 'MORTO (rode -Soltar e arme de novo)' }
    Anota ("ARMADO desde {0} | vigia pid {1} {2} | tampa antes: AC={3} DC={4}" -f $d.Desde, $d.VigiaPid, $situacao, $d.TampaAC, $d.TampaDC)
  } else {
    Anota 'SOLTO - nada segurando a maquina acordada'
  }
  $t = TampaAtual
  if ($t) { Anota ("tampa agora: AC={0} DC={1}  (0=nao faz nada, 1=suspender, 2=hibernar, 3=desligar)" -f $t.AC, $t.DC) }
  return
}

# ---------------------------------------------------------------- Soltar
if ($Soltar) {
  if (SinalCheio) {
    $d = Get-Content $Sinal -Raw | ConvertFrom-Json
    Get-Process -Id $d.VigiaPid -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    DefineTampa $d.TampaAC $d.TampaDC
    Set-Content -Path $Sinal -Value '' -Encoding utf8
    Anota ("SOLTO: vigia {0} encerrado e tampa devolvida pra AC={1} DC={2}" -f $d.VigiaPid, $d.TampaAC, $d.TampaDC)
  } else {
    Anota 'ja estava solto'
  }
  return
}

# ---------------------------------------------------------------- Armar
if (SinalCheio) {
  $d = Get-Content $Sinal -Raw | ConvertFrom-Json
  if (Get-Process -Id $d.VigiaPid -ErrorAction SilentlyContinue) {
    Anota ("ja armado (vigia {0}); nao vou armar duas vezes" -f $d.VigiaPid)
    if (-not $Armar) { Anota 'trancando a tela'; rundll32.exe user32.dll,LockWorkStation }
    return
  }
  Anota 'havia sinal antigo com vigia morto; rearmando'
}

# A conta precisa ter senha, senao o cadeado e falsa sensacao de seguranca.
$conta = Get-LocalUser -Name $env:USERNAME -ErrorAction SilentlyContinue
if ($conta -and -not $conta.PasswordLastSet) {
  Anota 'RECUSADO: esta conta nunca teve senha definida. Trancar agora abriria com um Enter.'
  Anota 'Defina uma senha em Configuracoes > Contas > Opcoes de entrada e rode de novo.'
  return
}

$tampa = TampaAtual
if (-not $tampa) { throw 'nao achei a configuracao da tampa no registro' }

# O vigia nasce pelo WMI (Win32_Process.Create) de proposito: assim ele nao e
# filho desta sessao e nao morre junto com quem o disparou. Mesma licao que a
# corrente da passagem de bastao aprendeu em 02/09/2026.
$corpo = @'
$ErrorActionPreference = "SilentlyContinue"
$assinatura = @"
[DllImport("kernel32.dll", SetLastError = true)]
public static extern uint SetThreadExecutionState(uint esFlags);
"@
Add-Type -Namespace Nativo -Name Energia -MemberDefinition $assinatura
$ES_CONTINUOUS = [uint32]2147483648
$ES_SYSTEM_REQUIRED = [uint32]1
$anterior = [Nativo.Energia]::SetThreadExecutionState($ES_CONTINUOUS -bor $ES_SYSTEM_REQUIRED)
$log = Join-Path $env:USERPROFILE ".claude\cadeado.log"
function Diz($t) { Add-Content $log ((Get-Date -Format "yyyy-MM-dd HH:mm:ss") + "  " + $t) -Encoding utf8 }
Diz "vigia $PID de pe; SetThreadExecutionState devolveu $anterior (0 = FALHOU)"
$limite = (Get-Date).AddHours(__TETO__)
$sumiuDesde = $null
while ($true) {
  Start-Sleep -Seconds 30
  if ((Get-Date) -gt $limite) { Diz "vigia $PID saindo: teto de __TETO__ horas"; break }
  $claude = @(Get-Process -Name claude -ErrorAction SilentlyContinue)
  if ($claude.Count -gt 0) { $sumiuDesde = $null; continue }
  if (-not $sumiuDesde) { $sumiuDesde = Get-Date; continue }
  if (((Get-Date) - $sumiuDesde).TotalMinutes -ge 3) { Diz "vigia $PID saindo: nenhum claude.exe ha 3 min"; break }
}
[Nativo.Energia]::SetThreadExecutionState($ES_CONTINUOUS) | Out-Null
$sinal = Join-Path $env:USERPROFILE ".claude\cadeado.sinal"
try { Set-Content -Path $sinal -Value "" -Encoding utf8 } catch {}
'@
$corpo = $corpo.Replace('__TETO__', "$TetoHoras")

$arqVigia = Join-Path $Base 'cadeado-vigia.ps1'
Set-Content -Path $arqVigia -Value $corpo -Encoding utf8

$cmd = 'powershell.exe -NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File "' + $arqVigia + '"'
$r = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{ CommandLine = $cmd }
if ($r.ReturnValue -ne 0) { throw "nao consegui subir o vigia (Win32_Process.Create devolveu $($r.ReturnValue))" }
$pidVigia = [int]$r.ProcessId

DefineTampa 0 0

$dados = [ordered]@{
  Desde    = (Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
  VigiaPid = $pidVigia
  TampaAC  = $tampa.AC
  TampaDC  = $tampa.DC
  Teto     = $TetoHoras
}
Set-Content -Path $Sinal -Value ($dados | ConvertTo-Json -Compress) -Encoding utf8
Anota ("ARMADO: vigia {0}; tampa presa (era AC={1} DC={2}); teto {3}h" -f $pidVigia, $tampa.AC, $tampa.DC, $TetoHoras)

if (-not $Armar) {
  Anota 'trancando a tela'
  rundll32.exe user32.dll,LockWorkStation
}
