$ErrorActionPreference = "Stop"

# Caminhos possíveis do mongod.cfg
$cfgPaths = @(
    "C:\Program Files\MongoDB\Server\7.0\bin\mongod.cfg",
    "C:\Program Files\MongoDB\Server\6.0\bin\mongod.cfg",
    "C:\Program Files\MongoDB\Server\5.0\bin\mongod.cfg"
)

$cfgFile = $null
foreach ($path in $cfgPaths) {
    if (Test-Path $path) {
        $cfgFile = $path
        break
    }
}

if (!$cfgFile) {
    Write-Host "❌ mongod.cfg não encontrado."
    Read-Host "Pressione Enter para sair..."
    Exit
}

Write-Host "✅ Configuração encontrada: $cfgFile"

# Ler e modificar
$content = Get-Content $cfgFile -Raw
if ($content -match "replSetName") {
    Write-Host "⚠️ Já configurado."
}
else {
    $newContent = $content + "`nreplication:`n  replSetName: rs0`n"
    Set-Content -Path $cfgFile -Value $newContent
    Write-Host "✅ Adicionado replSetName: rs0"
}

# Reiniciar Serviço
Write-Host "🔄 Reiniciando MongoDB..."
Restart-Service -Name "MongoDB" -Force
Write-Host "✅ Serviço reiniciado."

# Inicializar RS
Write-Host "🚀 Inicializando RS..."
Set-Location "c:\Projetos\NovaFitness"
npm install mongodb --no-save
node init-rs.js

Write-Host "🎉 SUCESSO! Janela fechará em 5s..."
Start-Sleep -Seconds 5
