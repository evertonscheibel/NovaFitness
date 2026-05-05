# 📋 Próximos Passos - Configuração do Sistema

Você completou a implementação do código! Agora precisa configurar as credenciais para conectar ao MongoDB Atlas usando Google Cloud Secret Manager.

---

## ✅ O que já foi feito

- ✅ Instalado `@google-cloud/secret-manager`
- ✅ Criado serviço de Secret Manager (`secret-manager.service.js`)
- ✅ Atualizado conexão do banco de dados (`db.js`)
- ✅ Configurado SSL/TLS e retry logic
- ✅ Criado documentação completa
- ✅ Atualizado `.gitignore` para proteger credenciais
- ✅ Criado script de teste de conexão

---

## 🚀 Próximos Passos (Você precisa fazer)

### Passo 1: Configurar MongoDB Atlas

1. **Acesse seu MongoDB Atlas**: https://cloud.mongodb.com/
2. **Localize ou crie um cluster**
3. **Crie um usuário do banco de dados**:
   - Vá em "Database Access"
   - Crie um usuário com permissões de leitura/escrita
   - **Anote o usuário e senha**

4. **Configure Network Access**:
   - Vá em "Network Access"
   - Adicione seu IP atual OU `0.0.0.0/0` (para desenvolvimento)

5. **Obtenha a Connection String**:
   - Clique em "Connect" no seu cluster
   - Escolha "Connect your application"
   - Copie a string (formato: `mongodb+srv://...`)
   - **Substitua `<password>` pela senha real**
   - **Adicione o nome do banco** após `.mongodb.net/`:
     ```
     mongodb+srv://usuario:senha@cluster.mongodb.net/novafitness?retryWrites=true&w=majority
     ```

📖 **Guia detalhado**: Veja `MONGODB_ATLAS_SETUP.md` para instruções passo a passo com screenshots

---

### Passo 2: Configurar Google Cloud Secret Manager

#### Opção A: Via Console (Mais Fácil)

1. **Acesse Google Cloud Console**: https://console.cloud.google.com/
2. **Selecione ou crie um projeto**
3. **Habilite Secret Manager API**:
   - Vá em "APIs & Services" → "Library"
   - Busque "Secret Manager API"
   - Clique em "Enable"

4. **Crie o Secret**:
   - Vá em "Security" → "Secret Manager"
   - Clique em "Create Secret"
   - **Name**: `MONGODB_URI`
   - **Secret value**: Cole a connection string completa do MongoDB
   - Clique em "Create Secret"

5. **Crie Service Account**:
   - Vá em "IAM & Admin" → "Service Accounts"
   - Clique em "Create Service Account"
   - **Name**: `novafitness-backend`
   - **Role**: Adicione "Secret Manager Secret Accessor"
   - Clique em "Done"

6. **Baixe Credenciais JSON**:
   - Na lista de service accounts, clique nos 3 pontos (⋮) ao lado de `novafitness-backend`
   - Selecione "Manage keys"
   - Clique em "Add Key" → "Create new key"
   - Escolha "JSON"
   - O arquivo será baixado automaticamente
   - **Mova este arquivo para**: `c:\Projetos\NovaFitness\server\config\gcp-credentials.json`

#### Opção B: Via gcloud CLI (Avançado)

```bash
# Habilitar API
gcloud services enable secretmanager.googleapis.com

# Criar secret (cole a URI quando solicitado)
gcloud secrets create MONGODB_URI --data-file=-

# Criar service account
gcloud iam service-accounts create novafitness-backend

# Conceder permissão
gcloud secrets add-iam-policy-binding MONGODB_URI \
  --member="serviceAccount:novafitness-backend@SEU-PROJETO-ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Baixar credenciais
gcloud iam service-accounts keys create ./config/gcp-credentials.json \
  --iam-account=novafitness-backend@SEU-PROJETO-ID.iam.gserviceaccount.com
```

---

### Passo 3: Configurar Variáveis de Ambiente

1. **Edite o arquivo `.env`** em `c:\Projetos\NovaFitness\server\.env`:

```env
# Google Cloud
GOOGLE_CLOUD_PROJECT_ID=seu-projeto-id-aqui
GOOGLE_APPLICATION_CREDENTIALS=./config/gcp-credentials.json
MONGODB_SECRET_NAME=MONGODB_URI

# Servidor
PORT=5000
NODE_ENV=development

# IA (mantenha suas chaves existentes)
OPENAI_API_KEY=sua_chave_openai
# ou
GROQ_API_KEY=sua_chave_groq
```

**Como encontrar o Project ID:**
- No Google Cloud Console, o ID está no topo da página
- Ou vá em "IAM & Admin" → "Settings"

---

### Passo 4: Verificar Estrutura de Arquivos

Certifique-se que você tem:

```
c:\Projetos\NovaFitness\server\
├── config/
│   └── gcp-credentials.json  ← Arquivo JSON baixado do Google Cloud
├── src/
│   ├── config/
│   │   └── google-cloud-config.js
│   ├── services/
│   │   └── secret-manager.service.js
│   ├── db.js
│   └── test-connection.js
├── .env                      ← Configurado com suas variáveis
├── .env.example
└── package.json
```

---

### Passo 5: Testar Conexão

```bash
cd c:\Projetos\NovaFitness\server
npm run test:db
```

**✅ Saída esperada (sucesso):**
```
🔐 Usando credenciais do Google Cloud: c:\Projetos\NovaFitness\server\config\gcp-credentials.json
✅ Google Cloud Secret Manager configurado para projeto: seu-projeto-id
🔄 Iniciando conexão com MongoDB Atlas...
🔍 Buscando secret: projects/seu-projeto-id/secrets/MONGODB_URI/versions/latest
✅ Secret 'MONGODB_URI' obtido com sucesso
✅ MongoDB Atlas conectado com sucesso!
📍 Host: cluster0-shard-00-01.xxxxx.mongodb.net
📊 Database: novafitness
🔒 SSL/TLS: Ativado
🎉 Todos os testes passaram com sucesso!
```

**❌ Se houver erro:**
- Veja a seção "Troubleshooting" em `QUICK_START.md`
- Verifique se todas as variáveis de ambiente estão corretas
- Confirme que o arquivo JSON de credenciais existe
- Valide que o secret foi criado no Google Cloud

---

### Passo 6: Iniciar o Sistema

Se o teste passou, inicie o servidor:

```bash
npm run dev
```

Você deve ver:
```
✅ Credenciais obtidas do Google Cloud Secret Manager
✅ MongoDB Atlas conectado com sucesso!
🚀 Servidor rodando na porta 5000
```

---

## 🔄 Alternativa: Configuração Simples (Sem Google Cloud)

Se você preferir não usar Google Cloud Secret Manager por enquanto, pode usar a configuração simples:

**Edite `.env`:**
```env
# Configuração simples (sem Google Cloud)
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/novafitness?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=sua_chave_openai
```

O sistema detectará automaticamente que não há configuração do Google Cloud e usará a variável `MONGODB_URI` diretamente.

---

## 📚 Documentação de Referência

- **[QUICK_START.md](./QUICK_START.md)** - Guia rápido de 15 minutos
- **[MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md)** - Guia completo com screenshots
- **[SECURITY_BEST_PRACTICES.md](./SECURITY_BEST_PRACTICES.md)** - Segurança e boas práticas
- **[README.md](./README.md)** - Documentação geral do projeto

---

## 🆘 Precisa de Ajuda?

Se encontrar problemas:
1. Execute `npm run test:db` para diagnóstico
2. Verifique os logs em `server/backend.log`
3. Consulte a seção de Troubleshooting nos guias
4. Me avise e posso ajudar a debugar!

---

## ✅ Checklist Final

- [ ] MongoDB Atlas cluster criado
- [ ] Usuário do banco criado
- [ ] IP adicionado à whitelist
- [ ] Connection string obtida
- [ ] Google Cloud Secret Manager habilitado
- [ ] Secret MONGODB_URI criado
- [ ] Service account criado
- [ ] Arquivo gcp-credentials.json baixado e no lugar certo
- [ ] Arquivo .env configurado
- [ ] Teste de conexão passou (`npm run test:db`)
- [ ] Servidor iniciou com sucesso (`npm run dev`)

---

**Boa sorte! 🚀**
