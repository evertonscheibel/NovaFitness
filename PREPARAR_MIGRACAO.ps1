# Script de Preparação para Migração NovaFitness
# Este script prepara o projeto para ser compactado e movido para outra máquina.

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   NovaFitness - Preparador de Migração" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# 1. Limpando builds antigos
Write-Host "`n1. Limpando builds antigos..." -ForegroundColor Yellow
if (Test-Path "client/dist") { Remove-Item -Recurse -Force "client/dist" }
if (Test-Path "server/dist") { Remove-Item -Recurse -Force "server/dist" }

# 2. Gerando Prisma Client
Write-Host "`n2. Gerando Prisma Client (Backend)..." -ForegroundColor Yellow
Set-Location "server"
npm install --quiet
npx prisma generate
Set-Location ".."

# 3. Construindo Frontend (Produção)
Write-Host "`n3. Construindo Frontend (Vite)..." -ForegroundColor Yellow
Set-Location "client"
npm install --quiet
npm run build
Set-Location ".."

# 4. Verificando Arquivos de Configuração
Write-Host "`n4. Verificando templates de configuração..." -ForegroundColor Yellow
$files = @(
    "server/.env.example",
    "client/.env.example",
    "mobile/.env.example",
    "MIGRACAO_SISTEMA.md"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "  [OK] $file" -ForegroundColor Green
    }
    else {
        Write-Host "  [FALTA] $file" -ForegroundColor Red
    }
}

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "   PREPARAÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "Próximos passos:"
Write-Host "1. Você já pode compactar a pasta 'NovaFitness' em um .zip"
Write-Host "2. Siga as instruções em MIGRACAO_SISTEMA.md na nova máquina."
Write-Host "================================================" -ForegroundColor Cyan
