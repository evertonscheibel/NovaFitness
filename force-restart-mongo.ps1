# FORCE RESTART MongoDB - Execute como Admin

Write-Host "=== REINICIALIZAÇÃO FORÇADA ===" -ForegroundColor Cyan

# 1. Matar qualquer processo do MongoDB
Write-Host "`n1. Matando processos MongoDB..." -ForegroundColor Yellow
Stop-Process -Name "mongod" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# 2. Tentar parar o serviço
Write-Host "2. Parando serviço..." -ForegroundColor Yellow
Stop-Service MongoDB -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# 3. Verificar configuração
Write-Host "3. Verificando arquivo de configuração..." -ForegroundColor Yellow
if (Test-Path "C:\Program Files\MongoDB\Server\8.2\bin\mongod.cfg") {
    Write-Host "Arquivo encontrado. Conteúdo:" -ForegroundColor Gray
    Get-Content "C:\Program Files\MongoDB\Server\8.2\bin\mongod.cfg"
}
else {
    Write-Host "ERRO: Arquivo de configuração não encontrado!" -ForegroundColor Red
    exit
}

# 4. Iniciar serviço
Write-Host "`n4. Iniciando MongoDB..." -ForegroundColor Yellow
Start-Service MongoDB
Start-Sleep -Seconds 5

# 5. Verificar status
$status = Get-Service MongoDB
Write-Host "`nStatus: $($status.Status)" -ForegroundColor $(if ($status.Status -eq 'Running') { 'Green' }else { 'Red' })

if ($status.Status -eq 'Running') {
    Write-Host "`n✅ MongoDB INICIADO COM SUCESSO!" -ForegroundColor Green
    Write-Host "`nPressione ENTER para inicializar Replica Set..." -ForegroundColor Cyan
    Read-Host
    
    cd C:\Projetos\NovaFitness\server
    node init-replica.js
}
else {
    Write-Host "`n❌ MongoDB NÃO iniciou. Verifique o log em:" -ForegroundColor Red
    Write-Host "C:\Program Files\MongoDB\Server\8.2\log\mongod.log" -ForegroundColor Yellow
}
