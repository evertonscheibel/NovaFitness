@echo off
echo ========================================
echo  NovaFitness - Configurar Projeto
echo ========================================
echo.

REM Ir para a pasta server
cd /d "%~dp0server"

echo [1/4] Criando arquivo .env...
(
echo DATABASE_URL="mongodb://localhost:27017/novafitness"
echo OPENAI_API_KEY=""
echo PORT=5000
echo NODE_ENV=development
) > .env
echo  OK - Arquivo .env criado!
echo.

echo [2/4] Gerando Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo  ERRO ao gerar Prisma Client!
    pause
    exit /b 1
)
echo  OK - Prisma Client gerado!
echo.

echo [3/4] Sincronizando schema com MongoDB...
call npx prisma db push --skip-generate
if errorlevel 1 (
    echo  AVISO: Possivel erro na sincronizacao
    echo  Continuando...
)
echo  OK - Schema sincronizado!
echo.

echo [4/4] Iniciando servidor...
echo ========================================
echo.
call npm run dev
