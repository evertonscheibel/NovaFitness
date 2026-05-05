# Configure MongoDB as Replica Set - FIXED VERSION
# Run as Administrator

Write-Host "=== Configurando MongoDB como Replica Set ===" -ForegroundColor Cyan

# 1. PARAR o serviço PRIMEIRO
Write-Host "`n1. Parando serviço MongoDB..." -ForegroundColor Yellow
Stop-Service MongoDB -Force
Start-Sleep -Seconds 3

# 2. Backup do arquivo atual
Write-Host "2. Fazendo backup do mongod.cfg..." -ForegroundColor Yellow
if (Test-Path "C:\Program Files\MongoDB\Server\8.2\bin\mongod.cfg.backup") {
    Write-Host "   Backup já existe, pulando..." -ForegroundColor Gray
}
else {
    Copy-Item "C:\Program Files\MongoDB\Server\8.2\bin\mongod.cfg" "C:\Program Files\MongoDB\Server\8.2\bin\mongod.cfg.backup" -Force
}

# 3. Criar novo arquivo de configuração
Write-Host "3. Atualizando configuração..." -ForegroundColor Yellow
@"
# mongod.conf

# for documentation of all options, see:
#   http://docs.mongodb.org/manual/reference/configuration-options/

# Where and how to store data.
storage:
  dbPath: C:\Program Files\MongoDB\Server\8.2\data
  journal:
    enabled: true

# where to write logging data.
systemLog:
  destination: file
  logAppend: true
  path:  C:\Program Files\MongoDB\Server\8.2\log\mongod.log

# network interfaces
net:
  port: 27017
  bindIp: 127.0.0.1

# replication
replication:
  replSetName: "rs0"
"@ | Out-File -FilePath "C:\Program Files\MongoDB\Server\8.2\bin\mongod.cfg" -Encoding UTF8 -Force

# 4. Iniciar serviço
Write-Host "4. Iniciando serviço MongoDB..." -ForegroundColor Yellow
Start-Service MongoDB
Start-Sleep -Seconds 5

# 5. Verificar status
Write-Host "`n5. Status do serviço:" -ForegroundColor Yellow
Get-Service MongoDB | Select-Object Name, Status, DisplayName

Write-Host "`n=== Configuração concluída! ===" -ForegroundColor Green
Write-Host "Aguarde 5 segundos e pressione ENTER para inicializar o Replica Set..." -ForegroundColor Cyan
Read-Host

# 6. Inicializar Replica Set
Write-Host "`n6. Inicializando Replica Set..." -ForegroundColor Yellow
Set-Location "C:\Projetos\NovaFitness\server"
node init-replica.js

Write-Host "`n=== CONCLUÍDO! ===" -ForegroundColor Green
