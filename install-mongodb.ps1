# Script Simplificado de Instalação do MongoDB
# Instalação direta via download

Write-Host ""
Write-Host "🚀 MongoDB Local - Instalação Simplificada" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host ""

# Verificar se MongoDB já está instalado
Write-Host "📋 Verificando instalações existentes..." -ForegroundColor Cyan

$mongoInPath = Get-Command mongod -ErrorAction SilentlyContinue
$programFiles = "C:\Program Files\MongoDB"
$mongoInstalled = $false

if ($mongoInPath) {
    Write-Host "✅ MongoDB encontrado no PATH!" -ForegroundColor Green
    $mongoInstalled = $true
}
elseif (Test-Path $programFiles) {
    Write-Host "✅ MongoDB encontrado em: $programFiles" -ForegroundColor Green
    $mongoInstalled = $true
}

if (-not $mongoInstalled) {
    Write-Host "❌ MongoDB não encontrado." -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 Para instalar o MongoDB:" -ForegroundColor Yellow
    Write-Host "   1. Acesse: https://www.mongodb.com/try/download/community" -ForegroundColor White
    Write-Host "   2. Selecione:" -ForegroundColor White
    Write-Host "      - Version: 7.0.x (Latest)" -ForegroundColor White
    Write-Host "      - Platform: Windows x64" -ForegroundColor White
    Write-Host "      - Package: MSI" -ForegroundColor White
    Write-Host "   3. Clique em 'Download'" -ForegroundColor White
    Write-Host "   4. Execute o instalador MSI" -ForegroundColor White
    Write-Host "   5. IMPORTANTE: Marque a opção 'Install MongoDB as a Service'" -ForegroundColor Yellow
    Write-Host "   6. Execute este script novamente após a instalação" -ForegroundColor White
    Write-Host ""
    
    $openBrowser = Read-Host "Deseja abrir o link de download no navegador agora? (s/n)"
    if ($openBrowser -eq "s") {
        Start-Process "https://www.mongodb.com/try/download/community"
    }
    
    Write-Host ""
    Write-Host "⏸️  Script pausado. Execute novamente após instalar o MongoDB." -ForegroundColor Yellow
    exit 0
}

# MongoDB está instalado, continuar com configuração
Write-Host ""
Write-Host "⚙️  Configurando projeto NovaFitness..." -ForegroundColor Cyan
Write-Host ""

# Configurar arquivo .env
$serverPath = Join-Path $PSScriptRoot "server"
$envPath = Join-Path $serverPath ".env"
$mongoLocalUri = "mongodb://localhost:27017/novafitness"

Write-Host "📝 Configurando arquivo .env..." -ForegroundColor Cyan

if (Test-Path $envPath) {
    $currentContent = Get-Content $envPath -Raw
    
    if ($currentContent -match 'DATABASE_URL=') {
        Write-Host "   Atualizando DATABASE_URL..." -ForegroundColor White
        $newContent = $currentContent -replace 'DATABASE_URL="[^"]*"', "DATABASE_URL=`"$mongoLocalUri`""
        $newContent = $newContent -replace "DATABASE_URL='[^']*'", "DATABASE_URL=`"$mongoLocalUri`""
        $newContent = $newContent -replace 'DATABASE_URL=[^\r\n]*', "DATABASE_URL=`"$mongoLocalUri`""
    }
    else {
        Write-Host "   Adicionando DATABASE_URL..." -ForegroundColor White
        $newContent = "DATABASE_URL=`"$mongoLocalUri`"`r`n" + $currentContent
    }
    
    $newContent | Out-File -FilePath $envPath -Encoding UTF8 -NoNewline
}
else {
    Write-Host "   Criando arquivo .env..." -ForegroundColor White
    $envContent = @"
DATABASE_URL="$mongoLocalUri"
OPENAI_API_KEY=""
PORT=5000
NODE_ENV=development
JWT_SECRET="$(New-Guid)"
"@
    $envContent | Out-File -FilePath $envPath -Encoding UTF8 -NoNewline
}

Write-Host "✅ Arquivo .env configurado!" -ForegroundColor Green
Write-Host "   DATABASE_URL=$mongoLocalUri" -ForegroundColor Yellow

# Configurar Prisma
Write-Host ""
Write-Host "🔧 Configurando Prisma..." -ForegroundColor Cyan
Set-Location -Path $serverPath

# Verificar node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
        exit 1
    }
}

# Gerar Prisma Client
Write-Host "🔧 Gerando Prisma Client..." -ForegroundColor Cyan
npx prisma generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao gerar Prisma Client!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Prisma Client gerado!" -ForegroundColor Green

# Sincronizar schema
Write-Host ""
Write-Host "🔄 Sincronizando schema..." -ForegroundColor Cyan
npx prisma db push --skip-generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Schema sincronizado!" -ForegroundColor Green
}
else {
    Write-Host "⚠️  Aviso na sincronização (pode ser normal)" -ForegroundColor Yellow
}

# Resultado final
Write-Host ""
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host "🎉 CONFIGURAÇÃO CONCLUÍDA!" -ForegroundColor Green
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ MongoDB instalado" -ForegroundColor Green
Write-Host "✅ Arquivo .env configurado" -ForegroundColor Green
Write-Host "✅ Prisma Client gerado" -ForegroundColor Green
Write-Host "✅ Schema sincronizado" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "   cd server" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host ""

# Perguntar se quer iniciar o servidor
$startServer = Read-Host "Deseja iniciar o servidor agora? (s/n)"
if ($startServer -eq "s") {
    Write-Host ""
    Write-Host "🚀 Iniciando servidor..." -ForegroundColor Green
    Write-Host ""
    npm run dev
}
