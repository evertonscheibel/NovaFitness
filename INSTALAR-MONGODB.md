# 🚀 Guia Rápido: Instalar MongoDB Local

## Passo 1: Download e Instalação

1. **A página de download do MongoDB deve ter aberto no seu navegador**
   - Se não abriu, acesse: https://www.mongodb.com/try/download/community

2. **Configurações de Download:**
   - Version: `7.0.x` (ou a versão mais recente)
   - Platform: `Windows x64`
   - Package: `msi`

3. **Clique em "Download"**

4. **Execute o instalador MSI:**
   - Escolha: **"Complete"** installation
   - ✅ **IMPORTANTE:** Marque **"Install MongoDB as a Service"**
   - Continue com as opções padrão
   - Complete a instalação

## Passo 2: Configurar o Projeto

Após a instalação do MongoDB, execute o arquivo `configure-project.bat` que foi criado na pasta do projeto:

```cmd
configure-project.bat
```

OU execute os comandos manualmente:

```powershell
cd c:\Projetos\NovaFitness\server
npx prisma generate
npx prisma db push
npm run dev
```

## Passo 3: Verificar

Se tudo funcionou, você verá:
```
✅ MongoDB conectado com sucesso!
📊 Database: MongoDB Local
🚀 Servidor rodando na porta 5000
```

## ⚠️ Problemas Comuns

### MongoDB não está rodando
```powershell
# Verificar status do serviço
Get-Service MongoDB

# Iniciar serviço
Start-Service MongoDB
```

### Erro de conexão
- Verifique se o MongoDB foi instalado como serviço
- Confirme que a porta 27017 está disponível
- Reinicie o computador se necessário
