# Script de Configuração Rápida do MongoDB Atlas
# NovaFitness - Setup Simplificado

Write-Host ""
Write-Host "🚀 ==============================================" -ForegroundColor Cyan
Write-Host "   NovaFitness - Configuração MongoDB Atlas" -ForegroundColor Cyan
Write-Host "============================================== 🚀" -ForegroundColor Cyan
Write-Host ""

# Verificar se já existe arquivo .env
$envPath = Join-Path $PSScriptRoot ".env"
$envExamplePath = Join-Path $PSScriptRoot ".env.example"

if (Test-Path $envPath) {
    Write-Host "⚠️  Arquivo .env já existe!" -ForegroundColor Yellow
    Write-Host ""
    $overwrite = Read-Host "Deseja sobrescrevê-lo? (s/n)"
    if ($overwrite -ne "s") {
        Write-Host "❌ Operação cancelada." -ForegroundColor Red
        exit
    }
}

Write-Host ""
Write-Host "📝 Digite as informações do MongoDB Atlas:" -ForegroundColor Green
Write-Host ""

# Coletar informações
$mongoUser = Read-Host "👤 Usuário do MongoDB (ex: novafitness)"
$mongoPassword = Read-Host "🔐 Senha do MongoDB" -AsSecureString
$mongoPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($mongoPassword))

$mongoCluster = Read-Host "🌐 Cluster (ex: cluster0.xxxxx.mongodb.net)"
$dbName = Read-Host "📊 Nome do Banco de Dados (padrão: novafitness)" 

if ([string]::IsNullOrWhiteSpace($dbName)) {
    $dbName = "novafitness"
}

Write-Host ""
Write-Host "🔑 (Opcional) OpenAI API Key para geração de treinos:" -ForegroundColor Cyan
$openaiKey = Read-Host "API Key (deixe em branco se não tiver)"

# Gerar string de conexão
$connectionString = "mongodb+srv://${mongoUser}:${mongoPasswordPlain}@${mongoCluster}/${dbName}?retryWrites=true&w=majority&appName=NovaFitness"

# Criar conteúdo do .env
$envContent = @"
# MongoDB Atlas Connection
DATABASE_URL="$connectionString"

# OpenAI (para geração automática de treinos)
OPENAI_API_KEY="$openaiKey"

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (gerado automaticamente)
JWT_SECRET="$(New-Guid)"

# Configurado em: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
"@

# Salvar arquivo .env
$envContent | Out-File -FilePath $envPath -Encoding UTF8

Write-Host ""
Write-Host "✅ Arquivo .env criado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host ""
Write-Host "   1. Gerar o Prisma Client:" -ForegroundColor White
Write-Host "      cd server" -ForegroundColor Yellow
Write-Host "      npx prisma generate" -ForegroundColor Yellow
Write-Host ""
Write-Host "   2. (Opcional) Sincronizar o schema:" -ForegroundColor White
Write-Host "      npx prisma db push" -ForegroundColor Yellow
Write-Host ""
Write-Host "   3. Iniciar o servidor:" -ForegroundColor White
Write-Host "      npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔒 Lembre-se: Nunca commite o arquivo .env no Git!" -ForegroundColor Red
Write-Host ""

# Perguntar se quer executar os comandos automaticamente
Write-Host "💡 Deseja executar os comandos automaticamente? (s/n)" -ForegroundColor Cyan
$autoRun = Read-Host

if ($autoRun -eq "s") {
    Write-Host ""
    Write-Host "⏳ Executando comandos..." -ForegroundColor Yellow
    Write-Host ""
    
    # Navegar para a pasta server
    Set-Location -Path (Join-Path $PSScriptRoot "server")
    
    # Gerar Prisma Client
    Write-Host "📦 Gerando Prisma Client..." -ForegroundColor Cyan
    npx prisma generate
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Prisma Client gerado!" -ForegroundColor Green
        Write-Host ""
        
        # Sincronizar schema
        Write-Host "🔄 Sincronizando schema com MongoDB..." -ForegroundColor Cyan
        npx prisma db push
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Schema sincronizado!" -ForegroundColor Green
            Write-Host ""
            Write-Host "🎉 Tudo pronto! Iniciando servidor..." -ForegroundColor Green
            Write-Host ""
            npm run dev
        }
    }
}
else {
    Write-Host ""
    Write-Host "👍 Ok! Execute os comandos manualmente quando estiver pronto." -ForegroundColor Cyan
    Write-Host ""
}
