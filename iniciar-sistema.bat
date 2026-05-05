@echo off
echo ==========================================
echo   NovaFitness - Iniciar Sistema Local
echo ==========================================
echo.
echo 1. Verificando MongoDB...
echo    (Certifique-se que o MongoDB Community Server esta rodando)
echo.
echo 2. Iniciando Backend (Porta 5000)...
start "NovaFitness Backend" cmd /k "cd server && npm run dev"
echo.
echo 3. Iniciando Frontend (Porta 5173)...
start "NovaFitness Client" cmd /k "cd client && npm run dev"
echo.
echo ==========================================
echo   Sistema iniciando!
echo   Acesse: http://localhost:5173
echo ==========================================
pause
