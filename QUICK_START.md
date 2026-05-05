# 🚀 Guia Rápido de Configuração

Este guia fornece os passos essenciais para configurar o NovaFitness com MongoDB Atlas e Google Cloud Secret Manager.

---

## ⚡ Configuração Rápida (15 minutos)

### 1. Pré-requisitos
- ✅ Conta Google Cloud Platform
- ✅ Conta MongoDB Atlas
- ✅ Node.js instalado

### 2. MongoDB Atlas

**Criar cluster e obter URI:**
1. Acesse [MongoDB Atlas](https://cloud.mongodb.com/)
2. Crie um cluster (M0 Free tier disponível)
3. Crie um usuário do banco de dados
4. Adicione seu IP à whitelist (ou `0.0.0.0/0` para desenvolvimento)
5. Obtenha a connection string:
   ```
   mongodb+srv://usuario:senha@cluster.mongodb.net/novafitness?retryWrites=true&w=majority
   ```

📖 **Guia detalhado:** [MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md)

### 3. Google Cloud Secret Manager

**Criar secret com a URI do MongoDB:**

```bash
# 1. Habilitar Secret Manager API
gcloud services enable secretmanager.googleapis.com

# 2. Criar secret
gcloud secrets create MONGODB_URI \
  --data-file=- \
  --replication-policy="automatic"
# Cole a URI do MongoDB e pressione Ctrl+D

# 3. Criar service account
gcloud iam service-accounts create novafitness-backend \
  --display-name="NovaFitness Backend"

# 4. Conceder permissão
gcloud secrets add-iam-policy-binding MONGODB_URI \
  --member="serviceAccount:novafitness-backend@SEU-PROJETO-ID.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# 5. Criar chave JSON
gcloud iam service-accounts keys create ./config/gcp-credentials.json \
  --iam-account=novafitness-backend@SEU-PROJETO-ID.iam.gserviceaccount.com
```

**Ou via Console:**
1. Acesse [Secret Manager](https://console.cloud.google.com/security/secret-manager)
2. Clique em "Create Secret"
3. Nome: `MONGODB_URI`
4. Valor: Cole a connection string do MongoDB
5. Crie um service account e baixe o JSON de credenciais

### 4. Configurar Aplicação

**Criar arquivo .env:**
```bash
cd c:\Projetos\NovaFitness\server
cp .env.example .env
```

**Editar .env:**
```env
# Google Cloud
GOOGLE_CLOUD_PROJECT_ID=seu-projeto-id
GOOGLE_APPLICATION_CREDENTIALS=./config/gcp-credentials.json
MONGODB_SECRET_NAME=MONGODB_URI

# Servidor
PORT=5000
NODE_ENV=development
```

**Colocar credenciais GCP:**
1. Baixe o arquivo JSON de credenciais do Google Cloud
2. Salve como: `c:\Projetos\NovaFitness\server\config\gcp-credentials.json`

### 5. Instalar Dependências

```bash
cd c:\Projetos\NovaFitness\server
npm install
```

### 6. Testar Conexão

```bash
npm run test:db
```

**Saída esperada:**
```
✅ Credenciais obtidas do Google Cloud Secret Manager
✅ MongoDB Atlas conectado com sucesso!
📍 Host: cluster0-shard-00-01.xxxxx.mongodb.net
📊 Database: novafitness
🔒 SSL/TLS: Ativado
🎉 Todos os testes passaram com sucesso!
```

### 7. Iniciar Servidor

```bash
npm run dev
```

---

## 🔧 Troubleshooting Rápido

### Erro: "GOOGLE_CLOUD_PROJECT_ID não encontrado"
```bash
# Verifique se o .env está configurado
cat .env

# Adicione a variável
echo "GOOGLE_CLOUD_PROJECT_ID=seu-projeto-id" >> .env
```

### Erro: "Could not load credentials"
```bash
# Verifique se o arquivo existe
ls config/gcp-credentials.json

# Verifique o caminho no .env
cat .env | grep GOOGLE_APPLICATION_CREDENTIALS
```

### Erro: "Secret not found"
```bash
# Liste os secrets disponíveis
gcloud secrets list

# Crie o secret se não existir
echo "mongodb+srv://..." | gcloud secrets create MONGODB_URI --data-file=-
```

### Erro: "Authentication failed" (MongoDB)
- Verifique usuário e senha na connection string
- Confirme que o usuário tem permissões de leitura/escrita
- Use URL encoding para caracteres especiais na senha

### Erro: "Connection timeout" (MongoDB)
- Adicione seu IP à whitelist do MongoDB Atlas
- Temporariamente, adicione `0.0.0.0/0` para testar
- Verifique sua conexão com a internet

---

## 📚 Documentação Completa

- **[MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md)** - Guia completo de configuração do MongoDB Atlas
- **[SECURITY_BEST_PRACTICES.md](./SECURITY_BEST_PRACTICES.md)** - Boas práticas de segurança
- **[README.md](./README.md)** - Documentação geral do projeto

---

## 🆘 Suporte

Se encontrar problemas:
1. Consulte a seção de Troubleshooting nos guias detalhados
2. Verifique os logs do servidor (`backend.log`)
3. Execute `npm run test:db` para diagnóstico
4. Revise as configurações do Google Cloud e MongoDB Atlas

---

## ✅ Checklist de Configuração

- [ ] MongoDB Atlas cluster criado
- [ ] Usuário do banco criado
- [ ] IP adicionado à whitelist
- [ ] Connection string obtida
- [ ] Google Cloud Secret Manager habilitado
- [ ] Secret MONGODB_URI criado
- [ ] Service account criado
- [ ] Arquivo JSON de credenciais baixado
- [ ] Arquivo .env configurado
- [ ] Credenciais GCP no lugar correto
- [ ] Dependências instaladas (`npm install`)
- [ ] Teste de conexão passou (`npm run test:db`)
- [ ] Servidor iniciado com sucesso (`npm run dev`)

---

**Tempo estimado:** 15-20 minutos  
**Última atualização:** 2025-12-05
