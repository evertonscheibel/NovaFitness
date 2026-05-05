# EXECUTE COMO ADMINISTRADOR
# Pare o MongoDB, modifique config, reinicie

# 1. Parar MongoDB
Write-Host "Parando MongoDB..." -ForegroundColor Yellow
net stop MongoDB

# 2. Criar novo config
Write-Host "Criando nova configuração..." -ForegroundColor Yellow
$config = @"
# mongod.conf
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
  replSetName: "rs0"
"@

$config | Out-File "C:\Program Files\MongoDB\Server\8.2\bin\mongod.cfg" -Encoding UTF8 -Force

# 3. Iniciar MongoDB
Write-Host "Iniciando MongoDB..." -ForegroundColor Yellow
net start MongoDB

Write-Host "`nMongoDB reiniciado com Replica Set!" -ForegroundColor Green
Write-Host "Pressione ENTER para inicializar o Replica Set..." -ForegroundColor Cyan
Read-Host

# 4. Inicializar Replica Set
Write-Host "Inicializando..." -ForegroundColor Yellow
cd C:\Projetos\NovaFitness\server
node init-replica.js

Write-Host "`nCONCLUÍDO!" -ForegroundColor Green
