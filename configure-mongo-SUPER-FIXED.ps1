# Configure MongoDB as Replica Set - SUPER FIXED VERSION
# Run as Administrator

Write-Host "=== Configurando MongoDB como Replica Set - Versao Corrigida ===" -ForegroundColor Cyan

# 1. PARAR o serviço PRIMEIRO
Write-Host "`n1. Parando serviço MongoDB..." -ForegroundColor Yellow
try {
    Stop-Service MongoDB -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 3
    Write-Host "   Serviço parado com sucesso" -ForegroundColor Green
}
catch {
    Write-Host "   Serviço já estava parado" -ForegroundColor Gray
}

# 2. Backup do arquivo atual
Write-Host "`n2. Fazendo backup do mongod.cfg..." -ForegroundColor Yellow
$configPath = "C:\Program Files\MongoDB\Server\8.2\bin\mongod.cfg"
$backupPath = "C:\Program Files\MongoDB\Server\8.2\bin\mongod.cfg.backup"

if (Test-Path $configPath) {
    if (-not (Test-Path $backupPath)) {
        Copy-Item $configPath $backupPath -Force
        Write-Host "   Backup criado" -ForegroundColor Green
    }
    else {
        Write-Host "   Backup já existe" -ForegroundColor Gray
    }
}

# 3. Verificar e criar pastas necessárias
Write-Host "`n3. Verificando pastas..." -ForegroundColor Yellow
$dataPath = "C:\Program Files\MongoDB\Server\8.2\data"
$logPath = "C:\Program Files\MongoDB\Server\8.2\log"

if (-not (Test-Path $dataPath)) {
    New-Item -ItemType Directory -Path $dataPath -Force | Out-Null
    Write-Host "   Pasta de dados criada" -ForegroundColor Green
}
else {
    Write-Host "   Pasta de dados OK" -ForegroundColor Green
}

if (-not (Test-Path $logPath)) {
    New-Item -ItemType Directory -Path $logPath -Force | Out-Null
    Write-Host "   Pasta de logs criada" -ForegroundColor Green
}
else {
    Write-Host "   Pasta de logs OK" -ForegroundColor Green
}

# 4. Criar arquivo de configuração (SEM BOM, só UTF-8)
Write-Host "`n4. Criando arquivo de configuração..." -ForegroundColor Yellow

$configContent = @"
# mongod.conf

# Where and how to store data.
storage:
  dbPath: C:\Program Files\MongoDB\Server\8.2\data
  journal:
    enabled: true

# where to write logging data.
systemLog:
  destination: file
  logAppend: true
  path: C:\Program Files\MongoDB\Server\8.2\log\mongod.log

# network interfaces
net:
  port: 27017
  bindIp: 127.0.0.1

# replication
replication:
  replSetName: "rs0"
"@

# Salvar sem BOM (UTF-8 puro)
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($configPath, $configContent, $utf8NoBom)
Write-Host "   Configuração criada com sucesso" -ForegroundColor Green

# 5. Tentar iniciar serviço
Write-Host "`n5. Iniciando serviço MongoDB..." -ForegroundColor Yellow
try {
    Start-Service MongoDB -ErrorAction Stop
    Start-Sleep -Seconds 5
    
    $service = Get-Service MongoDB
    if ($service.Status -eq "Running") {
        Write-Host "   MongoDB iniciado com SUCESSO!" -ForegroundColor Green
    }
    else {
        Write-Host "   MongoDB não iniciou. Status: $($service.Status)" -ForegroundColor Red
        Write-Host "`n   Verifique o log em: C:\Program Files\MongoDB\Server\8.2\log\mongod.log" -ForegroundColor Yellow
        exit 1
    }
}
catch {
    Write-Host "   ERRO ao iniciar MongoDB:" -ForegroundColor Red
    Write-Host "   $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n   Tentando iniciar manualmente..." -ForegroundColor Yellow
    
    # Tentar iniciar manualmente
    Start-Process -FilePath "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" -ArgumentList "--config `"$configPath`"" -NoNewWindow
    Start-Sleep -Seconds 5
}

# 6. Verificar status
Write-Host "`n6. Status do serviço:" -ForegroundColor Yellow
Get-Service MongoDB | Select-Object Name, Status, DisplayName | Format-Table

# 7. Aguardar e inicializar Replica Set
$service = Get-Service MongoDB
if ($service.Status -eq "Running") {
    Write-Host "`n=== MongoDB está rodando! ===" -ForegroundColor Green
    Write-Host "Pressione ENTER para inicializar o Replica Set..." -ForegroundColor Cyan
    Read-Host
    
    Write-Host "`n7. Inicializando Replica Set..." -ForegroundColor Yellow
    Set-Location "C:\Projetos\NovaFitness\server"
    node init-replica.js
    
    Write-Host "`n=== CONCLUÍDO! ===" -ForegroundColor Green
    Write-Host "MongoDB configurado como Replica Set e pronto para uso!" -ForegroundColor Cyan
}
else {
    Write-Host "`n=== ERRO ===" -ForegroundColor Red
    Write-Host "MongoDB não está rodando. Verifique os logs para mais detalhes." -ForegroundColor Yellow
    Write-Host "Log: C:\Program Files\MongoDB\Server\8.2\log\mongod.log" -ForegroundColor Gray
}
