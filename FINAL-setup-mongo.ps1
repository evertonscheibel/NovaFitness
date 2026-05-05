# SOLUÇÃO FINAL - EXECUTE COMO ADMINISTRADOR
Write-Host "=== CONFIGURAÇÃO FINAL DO MONGODB ===" -ForegroundColor Cyan

# 1. Parar serviço
Write-Host "`n1. Parando MongoDB..." -ForegroundColor Yellow
net stop MongoDB
Start-Sleep -Seconds 2

# 2. DELETAR o arquivo velho e criar um novo limpo
Write-Host "2. Recriando mongod.cfg..." -ForegroundColor Yellow
Remove-Item "C:\Program Files\MongoDB\Server\8.2\bin\mongod.cfg" -Force -ErrorAction SilentlyContinue

# Criar arquivo NOVO e LIMPO
@"
storage:
  dbPath: C:\Program Files\MongoDB\Server\8.2\data
  journal:
    enabled: true
systemLog:
  destination: file
  logAppend: true
  path: C:\Program Files\MongoDB\Server\8.2\log\mongod.log
net:
  port: 27017
  bindIp: 127.0.0.1
replication:
  replSetName: rs0
"@ | Out-File "C:\Program Files\MongoDB\Server\8.2\bin\mongod.cfg" -Encoding UTF8 -Force

# 3. Iniciar
Write-Host "3. Iniciando MongoDB..." -ForegroundColor Yellow
net start MongoDB
Start-Sleep -Seconds 5

# 4. Verificar configuração
Write-Host "`n4. Verificando arquivo de configuração..." -ForegroundColor Yellow
Get-Content "C:\Program Files\MongoDB\Server\8.2\bin\mongod.cfg" | Select-String "replSetName"

Write-Host "`n✅ MongoDB configurado!" -ForegroundColor Green
Write-Host "`nPressione ENTER para inicializar o Replica Set..." -ForegroundColor Cyan
Read-Host

# 5. Inicializar Replica Set
Write-Host "`nInicializando Replica Set..." -ForegroundColor Yellow
cd C:\Projetos\NovaFitness\server
node init-replica.js

Write-Host "`n=== MIGRAÇÃO COMPLETA! ===" -ForegroundColor Green
