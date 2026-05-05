# Configure MongoDB as Replica Set
# Run as Administrator

Write-Host "=== Configurando MongoDB como Replica Set ===" -ForegroundColor Cyan

# 1. Backup do arquivo atual
Write-Host "`n1. Fazendo backup do mongod.cfg..." -ForegroundColor Yellow
Copy-Item "C:\Program Files\MongoDB\Server\8.2\bin\mongod.cfg" "C:\Program Files\MongoDB\Server\8.2\bin\mongod.cfg.backup" -Force

# 2. Criar novo arquivo de configuração
Write-Host "2. Atualizando configuração..." -ForegroundColor Yellow
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

# 3. Reiniciar serviço
Write-Host "3. Reiniciando serviço MongoDB..." -ForegroundColor Yellow
Restart-Service MongoDB -Force

# 4. Aguardar inicialização
Write-Host "4. Aguardando MongoDB iniciar..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# 5. Verificar status
Write-Host "`n5. Status do serviço:" -ForegroundColor Yellow
Get-Service MongoDB | Select-Object Name, Status, DisplayName

Write-Host "`n=== Configuração concluída! ===" -ForegroundColor Green
Write-Host "Próximo passo: Execute 'node c:\Projetos\NovaFitness\server\init-replica.js' para inicializar o Replica Set" -ForegroundColor Cyan
