# 🚀 Configuração Simples - MongoDB Atlas Direto

Este guia mostra como configurar o NovaFitness com MongoDB Atlas **sem usar Google Cloud Secret Manager**.

---

## ⚡ Configuração Rápida (5 minutos)

### Passo 1: Obter URI do MongoDB Atlas

1. **Acesse MongoDB Atlas**: https://cloud.mongodb.com/
2. **Localize seu cluster** (ou crie um novo - tier gratuito disponível)
3. **Clique em "Connect"** no seu cluster
4. **Escolha "Connect your application"**
5. **Copie a connection string**

A string será algo como:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Passo 2: Personalizar a URI

**Substitua os valores:**
- `<username>` → seu usuário do banco
- `<password>` → sua senha (se tiver caracteres especiais, use URL encoding)
- Adicione o nome do banco após `.mongodb.net/`:

**Exemplo:**
```
mongodb+srv://meuusuario:minhasenha@cluster0.abc123.mongodb.net/novafitness?retryWrites=true&w=majority
```

> **⚠️ Importante:** Se sua senha tem caracteres especiais, use URL encoding:
> - `@` → `%40`
> - `#` → `%23`
> - `$` → `%24`
> - `%` → `%25`

### Passo 3: Configurar o arquivo .env

**Edite o arquivo** `c:\Projetos\NovaFitness\server\.env`:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://meuusuario:minhasenha@cluster0.abc123.mongodb.net/novafitness?retryWrites=true&w=majority

# Servidor
PORT=5000
NODE_ENV=development

# IA (mantenha suas chaves existentes)
OPENAI_API_KEY=sua_chave_openai
# ou
GROQ_API_KEY=sua_chave_groq
# ou
GEMINI_API_KEY=sua_chave_gemini
```

**Remova ou comente** as linhas do Google Cloud (se existirem):
```env
# GOOGLE_CLOUD_PROJECT_ID=...
# GOOGLE_APPLICATION_CREDENTIALS=...
# MONGODB_SECRET_NAME=...
```

### Passo 4: Configurar Network Access no MongoDB Atlas

1. No MongoDB Atlas, vá em **"Network Access"**
2. Clique em **"Add IP Address"**
3. Para desenvolvimento, escolha **"Allow Access from Anywhere"** (`0.0.0.0/0`)
   - Para produção, adicione apenas IPs específicos

### Passo 5: Criar Usuário do Banco (se ainda não tiver)

1. No MongoDB Atlas, vá em **"Database Access"**
2. Clique em **"Add New Database User"**
3. Configure:
   - **Username**: escolha um nome (ex: `novafitness-user`)
   - **Password**: gere uma senha segura (anote!)
   - **Database User Privileges**: "Read and write to any database"
4. Clique em **"Add User"**

### Passo 6: Testar Conexão

```bash
cd c:\Projetos\NovaFitness\server
npm run test:db
```

**✅ Saída esperada:**
```
🔄 Iniciando conexão com MongoDB Atlas...
⚠️  Erro ao obter secret, tentando variável de ambiente...
✅ MongoDB Atlas conectado com sucesso!
📍 Host: cluster0-shard-00-01.xxxxx.mongodb.net
📊 Database: novafitness
🔒 SSL/TLS: Ativado
🎉 Todos os testes passaram com sucesso!
```

> **Nota:** A mensagem "Erro ao obter secret" é normal - significa que está usando a variável de ambiente diretamente (sem Google Cloud).

### Passo 7: Iniciar o Servidor

```bash
npm run dev
```

Você deve ver:
```
⚠️  Erro ao obter secret, tentando variável de ambiente...
✅ MongoDB Atlas conectado com sucesso!
🚀 Servidor rodando na porta 5000
```

---

## 🔧 Troubleshooting

### Erro: "Authentication failed"
- ✅ Verifique se usuário e senha estão corretos
- ✅ Confirme que a senha foi URL-encoded se tiver caracteres especiais
- ✅ Verifique se o usuário tem permissões de leitura/escrita

### Erro: "Connection timeout"
- ✅ Adicione `0.0.0.0/0` no Network Access do MongoDB Atlas
- ✅ Verifique sua conexão com internet
- ✅ Confirme que o cluster está ativo (não pausado)

### Erro: "MONGODB_URI não encontrada"
- ✅ Verifique se o arquivo `.env` existe em `server/.env`
- ✅ Confirme que a variável está escrita corretamente: `MONGODB_URI=...`
- ✅ Reinicie o servidor após editar o `.env`

### Erro: "Invalid connection string"
- ✅ Verifique se a URI começa com `mongodb+srv://` ou `mongodb://`
- ✅ Confirme que não há espaços na URI
- ✅ Valide que o nome do banco está após `.mongodb.net/`

---

## 📋 Exemplo Completo de .env

```env
# ========================================
# MONGODB ATLAS
# ========================================
MONGODB_URI=mongodb+srv://novafitness-user:SenhaSegura123@cluster0.abc123.mongodb.net/novafitness?retryWrites=true&w=majority

# ========================================
# SERVIDOR
# ========================================
PORT=5000
NODE_ENV=development

# ========================================
# IA (escolha uma das opções)
# ========================================
# OpenAI
OPENAI_API_KEY=sk-proj-...

# OU Groq (alternativa gratuita)
# GROQ_API_KEY=gsk_...

# OU Google Gemini
# GEMINI_API_KEY=...
```

---

## ✅ Checklist

- [ ] MongoDB Atlas cluster criado
- [ ] Usuário do banco criado
- [ ] Senha anotada
- [ ] IP adicionado ao Network Access (`0.0.0.0/0` para dev)
- [ ] Connection string copiada
- [ ] Senha substituída na URI
- [ ] Nome do banco adicionado (`novafitness`)
- [ ] URI colada no `.env`
- [ ] Teste executado (`npm run test:db`)
- [ ] Teste passou com sucesso
- [ ] Servidor iniciado (`npm run dev`)

---

## 🎯 Vantagens desta Configuração

✅ **Simples** - Apenas uma variável de ambiente  
✅ **Rápido** - Configuração em 5 minutos  
✅ **Funcional** - Tudo que você precisa para desenvolvimento  
✅ **Seguro** - URI não é commitada no Git (protegida pelo .gitignore)  

---

## 🔐 Segurança

Mesmo sem Google Cloud Secret Manager, sua configuração é segura porque:

- ✅ `.env` está no `.gitignore` (nunca vai para o Git)
- ✅ Conexão usa SSL/TLS (criptografada)
- ✅ MongoDB Atlas tem autenticação forte
- ✅ IP whitelist controla acesso

**Para produção**, considere:
- Usar variáveis de ambiente do servidor (Heroku, Vercel, etc.)
- Ou migrar para Google Cloud Secret Manager (já está implementado!)

---

## 🚀 Pronto!

Após seguir estes passos, seu sistema estará rodando com MongoDB Atlas!

**Precisa de ajuda?** Me avise se encontrar algum erro.
