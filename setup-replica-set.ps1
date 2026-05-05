# Verificar Permissões de Admin
if (!([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "⚠️ Este script precisa ser executado como Administrador!" -ForegroundColor Red
    Start-Process powershell.exe "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    Exit
}

$ErrorActionPreference = "Stop"

Write-Host "🔍 Procurando instalação do MongoDB..." -ForegroundColor Cyan

# Tentar localizar o arquivo de configuração
$cfgPaths = @(
    "C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg",
    "C:\Program Files\MongoDB\Server\6.0\bin\mongod.cfg",
    "C:\Program Files\MongoDB\Server\5.0\bin\mongod.cfg"
)

$cfgFile = $null
foreach ($path in $cfgPaths) {
    if (Test-Path $path) {
        $cfgFile = $path
        break
    }
}

if (!$cfgFile) {
    Write-Host "❌ Arquivo mongod.cfg não encontrado em locais padrão." -ForegroundColor Red
    Write-Host "Por favor, configure o Replica Set manualmente."
    Exit
}

Write-Host "✅ Arquivo de configuração encontrado: $cfgFile" -ForegroundColor Green

# Ler conteúdo atual
$content = Get-Content $cfgFile -Raw

# Verificar se já tem replSetName
if ($content -match "replSetName") {
    Write-Host "⚠️ Configuração 'replSetName' já encontrada no arquivo." -ForegroundColor Yellow
}
else {
    Write-Host "⚙️ Adicionando configuração de Replica Set..." -ForegroundColor Cyan
    
    # Adicionar configuração de replicação
    $replicationConfig = "
replication:
  replSetName: rs0
"
    $newContent = $content + $replicationConfig
    Set-Content -Path $cfgFile -Value $newContent
    Write-Host "✅ Arquivo mongod.cfg atualizado." -ForegroundColor Green
}

# Reiniciar Serviço
Write-Host "🔄 Reiniciando serviço MongoDB..." -ForegroundColor Cyan
Restart-Service -Name "MongoDB" -Force
Write-Host "✅ Serviço reiniciado!" -ForegroundColor Green

Write-Host "⏳ Aguardando serviço subir completamente (5s)..."
Start-Sleep -Seconds 5

# Rodar script Node para iniciar RS
Write-Host "🚀 Inicializando Replica Set via Node.js..." -ForegroundColor Cyan
# Precisamos rodar o node no diretório atual
Set-Location $PSScriptRoot
npm install mongodb --no-save # Garantir driver
node init-rs.js

Write-Host "🎉 Processo concluído! Pressione qualquer tecla para sair." -ForegroundColor Green
Read-Host
