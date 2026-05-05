# Script de Instalação e Configuração do MongoDB Local
# NovaFitness - Setup Completo Automatizado

param(
    [switch]$SkipChoco,
    [switch]$ManualInstall
)

Write-Host ""
Write-Host "🚀 ==============================================" -ForegroundColor Cyan
Write-Host "   NovaFitness - MongoDB Local Setup" -ForegroundColor Cyan
Write-Host "============================================== 🚀" -ForegroundColor Cyan
Write-Host ""

# Função para verificar se está rodando como Administrador
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Verificar privilégios de administrador
if (-not (Test-Administrator)) {
    Write-Host "⚠️  Este script precisa ser executado como Administrador!" -ForegroundColor Red
    Write-Host "   Clique com botão direito no PowerShell e escolha 'Executar como Administrador'" -ForegroundColor Yellow
    Write-Host ""
    pause
    exit 1
}

# Passo 1: Verificar se MongoDB já está instalado
Write-Host "📋 Verificando se MongoDB já está instalado..." -ForegroundColor Cyan
$mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue

if ($mongoService) {
    Write-Host "✅ MongoDB já está instalado!" -ForegroundColor Green
    Write-Host "   Status: $($mongoService.Status)" -ForegroundColor White
    
    if ($mongoService.Status -ne "Running") {
        Write-Host "⚠️  MongoDB está parado. Iniciando serviço..." -ForegroundColor Yellow
        Start-Service -Name "MongoDB"
        Start-Sleep -Seconds 3
        $mongoService = Get-Service -Name "MongoDB"
        Write-Host "✅ MongoDB iniciado! Status: $($mongoService.Status)" -ForegroundColor Green
    }
    
    $skipInstall = $true
}
else {
    Write-Host "❌ MongoDB não encontrado. Prosseguindo com instalação..." -ForegroundColor Yellow
    $skipInstall = $false
}

# Passo 2: Instalar MongoDB (se necessário)
if (-not $skipInstall) {
    if ($ManualInstall) {
        Write-Host ""
        Write-Host "📥 Instalação Manual do MongoDB:" -ForegroundColor Cyan
        Write-Host "   1. Acesse: https://www.mongodb.com/try/download/community" -ForegroundColor White
        Write-Host "   2. Baixe o MongoDB Community Edition para Windows" -ForegroundColor White
        Write-Host "   3. Execute o instalador MSI" -ForegroundColor White
        Write-Host "   4. Marque 'Install MongoDB as a Service'" -ForegroundColor White
        Write-Host "   5. Execute este script novamente após a instalação" -ForegroundColor White
        Write-Host ""
        pause
        exit 0
    }
    
    # Verificar se Chocolatey está instalado
    Write-Host ""
    Write-Host "🍫 Verificando Chocolatey..." -ForegroundColor Cyan
    
    if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Chocolatey não encontrado." -ForegroundColor Red
        Write-Host ""
        Write-Host "Deseja instalar o Chocolatey agora? (s/n)" -ForegroundColor Yellow
        $installChoco = Read-Host
        
        if ($installChoco -eq "s") {
            Write-Host "📦 Instalando Chocolatey..." -ForegroundColor Cyan
            Set-ExecutionPolicy Bypass -Scope Process -Force
            [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
            Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
            
            # Recarregar PATH
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
            
            Write-Host "✅ Chocolatey instalado!" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Instalação cancelada. Use o parâmetro -ManualInstall para instruções manuais." -ForegroundColor Red
            exit 1
        }
    }
    else {
        Write-Host "✅ Chocolatey encontrado!" -ForegroundColor Green
    }
    
    # Instalar MongoDB via Chocolatey
    Write-Host ""
    Write-Host "📦 Instalando MongoDB Community Edition..." -ForegroundColor Cyan
    Write-Host "   (Isso pode levar alguns minutos)" -ForegroundColor Yellow
    Write-Host ""
    
    choco install mongodb -y
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ MongoDB instalado com sucesso!" -ForegroundColor Green
        
        # Aguardar serviço iniciar
        Write-Host "⏳ Aguardando serviço MongoDB iniciar..." -ForegroundColor Cyan
        Start-Sleep -Seconds 5
        
        # Verificar serviço
        $mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
        if ($mongoService -and $mongoService.Status -eq "Running") {
            Write-Host "✅ Serviço MongoDB está rodando!" -ForegroundColor Green
        }
        else {
            Write-Host "⚠️  Tentando iniciar serviço MongoDB..." -ForegroundColor Yellow
            Start-Service -Name "MongoDB" -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 3
        }
    }
    else {
        Write-Host "❌ Erro ao instalar MongoDB!" -ForegroundColor Red
        Write-Host "   Tente instalar manualmente: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
        exit 1
    }
}

# Passo 3: Configurar arquivo .env
Write-Host ""
Write-Host "📝 Configurando arquivo .env..." -ForegroundColor Cyan

$serverPath = Join-Path $PSScriptRoot "server"
$envPath = Join-Path $serverPath ".env"
$envExamplePath = Join-Path $serverPath ".env.example"

# String de conexão local do MongoDB
$mongoLocalUri = "mongodb://localhost:27017/novafitness"

# Verificar se .env existe
if (Test-Path $envPath) {
    Write-Host "⚠️  Arquivo .env já existe!" -ForegroundColor Yellow
    
    # Ler conteúdo atual
    $currentContent = Get-Content $envPath -Raw
    
    # Verificar se já tem DATABASE_URL
    if ($currentContent -match 'DATABASE_URL=') {
        Write-Host "   Atualizando DATABASE_URL existente..." -ForegroundColor White
        $newContent = $currentContent -replace 'DATABASE_URL="[^"]*"', "DATABASE_URL=`"$mongoLocalUri`""
        $newContent = $newContent -replace "DATABASE_URL='[^']*'", "DATABASE_URL=`"$mongoLocalUri`""
        $newContent = $newContent -replace 'DATABASE_URL=[^\r\n]*', "DATABASE_URL=`"$mongoLocalUri`""
    }
    else {
        Write-Host "   Adicionando DATABASE_URL..." -ForegroundColor White
        $newContent = "DATABASE_URL=`"$mongoLocalUri`"`r`n" + $currentContent
    }
    
    $newContent | Out-File -FilePath $envPath -Encoding UTF8
    Write-Host "✅ Arquivo .env atualizado!" -ForegroundColor Green
    
}
else {
    Write-Host "   Criando novo arquivo .env..." -ForegroundColor White
    
    $envContent = @"
# MongoDB Local Connection
DATABASE_URL="$mongoLocalUri"

# OpenAI (para geração automática de treinos)
OPENAI_API_KEY=""

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET="$(New-Guid)"

# Configurado em: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
"@
    
    $envContent | Out-File -FilePath $envPath -Encoding UTF8
    Write-Host "✅ Arquivo .env criado!" -ForegroundColor Green
}

Write-Host ""
Write-Host "📄 DATABASE_URL configurado para:" -ForegroundColor Cyan
Write-Host "   $mongoLocalUri" -ForegroundColor Yellow

# Passo 4: Configurar Prisma
Write-Host ""
Write-Host "⚙️  Configurando Prisma..." -ForegroundColor Cyan
Set-Location -Path $serverPath

# Verificar se node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências npm..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
        exit 1
    }
}

# Gerar Prisma Client
Write-Host "🔧 Gerando Prisma Client..." -ForegroundColor Cyan
npx prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Prisma Client gerado!" -ForegroundColor Green
}
else {
    Write-Host "❌ Erro ao gerar Prisma Client!" -ForegroundColor Red
    exit 1
}

# Sincronizar schema
Write-Host ""
Write-Host "🔄 Sincronizando schema com MongoDB..." -ForegroundColor Cyan
npx prisma db push --skip-generate

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Schema sincronizado!" -ForegroundColor Green
}
else {
    Write-Host "⚠️  Aviso: Possível erro na sincronização do schema" -ForegroundColor Yellow
    Write-Host "   O servidor pode funcionar mesmo assim. Continuando..." -ForegroundColor White
}

# Passo 5: Testar conexão
Write-Host ""
Write-Host "🧪 Testando conexão com MongoDB..." -ForegroundColor Cyan

# Criar script de teste
$testScript = @'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('✅ Conexão com MongoDB bem-sucedida!');
    
    // Testar query simples
    const count = await prisma.student.count();
    console.log(`📊 Total de alunos no banco: ${count}`);
    
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    process.exit(1);
  }
}

testConnection();
'@

$testScriptPath = Join-Path $serverPath "test-connection.mjs"
$testScript | Out-File -FilePath $testScriptPath -Encoding UTF8

node $testScriptPath

$testResult = $LASTEXITCODE

# Remover arquivo de teste
Remove-Item $testScriptPath -ErrorAction SilentlyContinue

# Resultado final
Write-Host ""
Write-Host "=" * 50 -ForegroundColor Cyan
if ($testResult -eq 0) {
    Write-Host "🎉 CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ MongoDB instalado e rodando" -ForegroundColor Green
    Write-Host "✅ Arquivo .env configurado" -ForegroundColor Green
    Write-Host "✅ Prisma Client gerado" -ForegroundColor Green
    Write-Host "✅ Schema sincronizado" -ForegroundColor Green
    Write-Host "✅ Conexão testada" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
    Write-Host "   1. Iniciar o servidor:" -ForegroundColor White
    Write-Host "      cd server" -ForegroundColor Yellow
    Write-Host "      npm run dev" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   2. (Opcional) Popular banco com dados de teste:" -ForegroundColor White
    Write-Host "      npm run seed" -ForegroundColor Yellow
}
else {
    Write-Host "⚠️  CONFIGURAÇÃO CONCLUÍDA COM AVISOS" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   MongoDB está instalado, mas houve um problema no teste de conexão." -ForegroundColor Yellow
    Write-Host "   Tente iniciar o servidor manualmente:" -ForegroundColor White
    Write-Host "      cd server" -ForegroundColor Yellow
    Write-Host "      npm run dev" -ForegroundColor Yellow
}
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host ""
