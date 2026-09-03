<#
  cadeado.ps1 - trancar a maquina e me deixar rodando (03/09/2026)

  Pedido dele: "quero que voce crie algum mecanismo para eu bloquear meu
  computador e voce continuar rodando. Esse bloqueio deve ser desbloqueavel
  somente por senha." E logo depois: "tem como tirar esse standby? Quero que
  quando eu bloquear ele, o sistema continue rodando PRA SEMPRE."

  POR QUE NAO BASTA O Win+L. Travar a estacao NAO mata processo nenhum: eu
  continuo rodando normalmente. O risco nesta maquina e outro:

    - E um NOTEBOOK com Modern Standby (S0 Ocioso com Baixo Consumo). Depois de
      ocioso o Windows desce pro estado de baixa energia e estrangula o que
      esta rodando em segundo plano.
    - Numa maquina TRANCADA quem manda e o "tempo limite de suspensao nao
      assistida", que e uma configuracao escondida e curta. E o pega de verdade.
    - Fechar a tampa manda dormir, e power request nenhum segura isso.

  ENTAO O CADEADO TEM QUATRO PECAS:

    1. VIGIA: processo destacado que segura SetThreadExecutionState com
       ES_CONTINUOUS | ES_SYSTEM_REQUIRED. Enquanto ele viver, o Windows nao
       desce pro estado ocioso. ES_DISPLAY_REQUIRED fica de fora de proposito:
       numa maquina trancada a tela deve apagar mesmo.
    2. TEMPOS: suspensao ociosa, hibernacao e suspensao NAO ASSISTIDA vao a
       zero (= nunca), nos dois modos. Os valores de antes ficam guardados.
    3. TAMPA: fechar a tampa vira "nao fazer nada", nos dois modos.
    4. CADEADO: LockWorkStation. Volta so com a credencial da conta.

  PRA SEMPRE, E ELE SABE O PRECO. Por padrao o vigia NAO solta sozinho: fica de
  pe ate o -Soltar. Isso e o que ele pediu. O preco e que a maquina nunca dorme
  enquanto isso, entao na bateria ela vai ate acabar. -TetoHoras N poe um teto
  em horas pra quem quiser rede de seguranca.

  "SOMENTE POR SENHA" QUEM DECIDE E O WINDOWS. A conta dele tem senha, entao o
  cadeado vale. Mas se houver PIN ou reconhecimento facial cadastrados, eles
  tambem abrem. Pra ser senha e mais nada: Configuracoes > Contas > Opcoes de
  entrada, tirar o Windows Hello. O script RECUSA trancar se a conta nunca teve
  senha, porque ai seria falsa sensacao de seguranca.

  O QUE EU PERCO COM A TELA TRANCADA: captura de tela sai preta, entao conferir
  cor e layout por imagem para de valer. O arquivo de sinal existe pra eu saber
  disso sozinho, sem tentar e falhar.

  USO:
    cadeado.ps1              tranca e segura a maquina acordada ate o -Soltar
    cadeado.ps1 -Armar       so segura, sem trancar (e assim que se prova)
    cadeado.ps1 -Soltar      desarma e devolve TUDO ao que era
    cadeado.ps1 -Estado      diz o que esta armado e o que esta segurando
    cadeado.ps1 -TetoHoras 8 igual, mas solta sozinho depois de 8 horas
#>
[CmdletBinding()]
param(
  [switch]$Armar,
  [switch]$Soltar,
  [switch]$Estado,
  [int]$TetoHoras = 0
)

$ErrorActionPreference = 'Stop'
$Base  = Join-Path $env:USERPROFILE '.claude'
$Sinal = Join-Path $Base 'cadeado.sinal'
$Log   = Join-Path $Base 'cadeado.log'

# subgrupo -> configuracao. Os tres primeiros sao o que faz a maquina dormir;
# o quarto e a tampa.
$SUB_SLEEP   = '238c9fa8-0aad-41ed-83f4-97be242c8f20'
$SUB_BUTTONS = '4f971e89-eebd-4455-a8de-9e59040e7347'
$ALVOS = [ordered]@{
  'suspender'   = @($SUB_SLEEP,   '29f6c1db-86da-48c5-9fdb-f2b67b1f44da')
  'hibernar'    = @($SUB_SLEEP,   '9d7815a6-7ee4-497e-8888-515a05f02364')
  'naoassistida'= @($SUB_SLEEP,   '7bc4a2f9-d8fc-4469-b07b-33eb785aaca0')
  'tampa'       = @($SUB_BUTTONS, '5ca83367-6e45-459f-a27b-476b1d01c936')
}

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

# ARMADILHA QUE CUSTOU UMA RODADA EM 03/09: varias destas configuracoes sao
# ESCONDIDAS (Attributes = 1). Elas nao aparecem no `powercfg /query` e,
# enquanto ninguem mexer, NAO EXISTE chave de override no registro. O
# `powercfg -setacvalueindex` grava mesmo assim, mas apagar a chave depois exige
# administrador (Remove-Item da "Acesso ao Registro nao permitido"). Ou seja:
# quem le so o override le nada, escreve por cima e nao consegue desfazer.
# Por isso a leitura cai no PADRAO DE FABRICA quando nao ha override, e o
# -Soltar devolve ESCREVENDO o valor, nunca apagando a chave.
function ValorAtual($sub, $set) {
  $g = EsquemaAtivo
  $over = "HKLM:\SYSTEM\CurrentControlSet\Control\Power\User\PowerSchemes\$g\$sub\$set"
  $fab  = "HKLM:\SYSTEM\CurrentControlSet\Control\Power\PowerSettings\$sub\$set\DefaultPowerSchemeValues\$g"
  $ac = $null; $dc = $null
  if (Test-Path $fab) { $p = Get-ItemProperty $fab; $ac = $p.ACSettingIndex; $dc = $p.DCSettingIndex }
  if (Test-Path $over) {
    $p = Get-ItemProperty $over
    if ($null -ne $p.ACSettingIndex) { $ac = $p.ACSettingIndex }
    if ($null -ne $p.DCSettingIndex) { $dc = $p.DCSettingIndex }
  }
  if ($null -eq $ac -and $null -eq $dc) { return $null }
  [pscustomobject]@{ AC = [int]$ac; DC = [int]$dc }
}

function DefineValor($sub, $set, $ac, $dc) {
  $g = EsquemaAtivo
  powercfg -setacvalueindex $g $sub $set $ac | Out-Null
  powercfg -setdcvalueindex $g $sub $set $dc | Out-Null
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
    $sit = if ($vivo) { 'VIVO' } else { 'MORTO (rode -Soltar e arme de novo)' }
    $teto = if ($d.Teto -gt 0) { "$($d.Teto)h" } else { 'sem teto (ate o -Soltar)' }
    Anota ("ARMADO desde {0} | vigia pid {1} {2} | teto: {3}" -f $d.Desde, $d.VigiaPid, $sit, $teto)
    foreach ($n in $d.Antes.PSObject.Properties.Name) {
      Anota ("  guardado {0}: AC={1} DC={2}" -f $n, $d.Antes.$n.AC, $d.Antes.$n.DC)
    }
  } else {
    Anota 'SOLTO - nada segurando a maquina acordada'
  }
  foreach ($n in $ALVOS.Keys) {
    $v = ValorAtual $ALVOS[$n][0] $ALVOS[$n][1]
    if ($v) { Anota ("  agora {0}: AC={1} DC={2}" -f $n, $v.AC, $v.DC) }
  }
  return
}

# ---------------------------------------------------------------- Soltar
if ($Soltar) {
  if (SinalCheio) {
    $d = Get-Content $Sinal -Raw | ConvertFrom-Json
    Get-Process -Id $d.VigiaPid -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    foreach ($n in $d.Antes.PSObject.Properties.Name) {
      if ($ALVOS.Contains($n)) {
        DefineValor $ALVOS[$n][0] $ALVOS[$n][1] $d.Antes.$n.AC $d.Antes.$n.DC
        Anota ("  {0} devolvido pra AC={1} DC={2}" -f $n, $d.Antes.$n.AC, $d.Antes.$n.DC)
      }
    }
    Set-Content -Path $Sinal -Value '' -Encoding utf8
    Anota ("SOLTO: vigia {0} encerrado e energia devolvida" -f $d.VigiaPid)
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

$conta = Get-LocalUser -Name $env:USERNAME -ErrorAction SilentlyContinue
if ($conta -and -not $conta.PasswordLastSet) {
  Anota 'RECUSADO: esta conta nunca teve senha definida. Trancar agora abriria com um Enter.'
  Anota 'Defina uma senha em Configuracoes > Contas > Opcoes de entrada e rode de novo.'
  return
}

# guarda o que era, ANTES de mexer em qualquer coisa
$antes = [ordered]@{}
foreach ($n in $ALVOS.Keys) {
  $v = ValorAtual $ALVOS[$n][0] $ALVOS[$n][1]
  if ($v) { $antes[$n] = @{ AC = $v.AC; DC = $v.DC } }
}
if ($antes.Count -eq 0) { throw 'nao consegui ler nenhuma configuracao de energia; nao vou mexer as cegas' }

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
$teto = __TETO__
$limite = if ($teto -gt 0) { (Get-Date).AddHours($teto) } else { $null }
while ($true) {
  Start-Sleep -Seconds 60
  # reafirma o pedido: se alguma politica derrubar, ele volta a valer
  [Nativo.Energia]::SetThreadExecutionState($ES_CONTINUOUS -bor $ES_SYSTEM_REQUIRED) | Out-Null
  if ($limite -and (Get-Date) -gt $limite) { Diz "vigia $PID saindo: teto de $teto horas"; break }
}
[Nativo.Energia]::SetThreadExecutionState($ES_CONTINUOUS) | Out-Null
'@
$corpo = $corpo.Replace('__TETO__', "$TetoHoras")

$arqVigia = Join-Path $Base 'cadeado-vigia.ps1'
Set-Content -Path $arqVigia -Value $corpo -Encoding utf8

$cmd = 'powershell.exe -NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File "' + $arqVigia + '"'
$r = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{ CommandLine = $cmd }
if ($r.ReturnValue -ne 0) { throw "nao consegui subir o vigia (Win32_Process.Create devolveu $($r.ReturnValue))" }
$pidVigia = [int]$r.ProcessId

foreach ($n in $antes.Keys) { DefineValor $ALVOS[$n][0] $ALVOS[$n][1] 0 0 }

$dados = [ordered]@{
  Desde    = (Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
  VigiaPid = $pidVigia
  Teto     = $TetoHoras
  Antes    = $antes
}
Set-Content -Path $Sinal -Value ($dados | ConvertTo-Json -Depth 5 -Compress) -Encoding utf8
$tetoTxt = if ($TetoHoras -gt 0) { "teto $TetoHoras h" } else { 'SEM TETO: so o -Soltar derruba' }
Anota ("ARMADO: vigia {0}; {1} configuracoes zeradas; {2}" -f $pidVigia, $antes.Count, $tetoTxt)
foreach ($n in $antes.Keys) { Anota ("  {0} era AC={1} DC={2}, agora 0/0" -f $n, $antes[$n].AC, $antes[$n].DC) }

if (-not $Armar) {
  Anota 'trancando a tela'
  rundll32.exe user32.dll,LockWorkStation
}
