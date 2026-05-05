# 🔧 Guia de Configuração - NovaFitness Backend

## ✅ Status Atual

- ✅ Dependências do backend instaladas (57 packages)
- ✅ Dependências do frontend instaladas (93 packages)
- ⚠️ MongoDB não detectado localmente
- ⚠️ Arquivo `.env` precisa ser configurado

---

## 📋 Configuração Necessária

### 1️⃣ Escolher Opção de Banco de Dados

Você tem **2 opções** para o MongoDB:

#### **Opção A: MongoDB Atlas (Cloud) - RECOMENDADO** ☁️

**Vantagens:**
- ✅ Não precisa instalar nada
- ✅ Grátis até 512MB
- ✅ Funciona de qualquer lugar
- ✅ Backup automático

**Passos:**

1. Acesse: https://www.mongodb.com/cloud/atlas/register
2. Crie uma conta gratuita
3. Crie um cluster (escolha a opção FREE)
4. Em "Database Access", crie um usuário com senha
5. Em "Network Access", adicione `0.0.0.0/0` (permitir de qualquer IP)
6. Clique em "Connect" → "Connect your application"
7. Copie a connection string (será algo como):
   ```
   mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/novafitness
   ```

#### **Opção B: MongoDB Local** 💻

**Passos:**

1. Baixe MongoDB Community: https://www.mongodb.com/try/download/community
2. Instale com as opções padrão
3. MongoDB rodará automaticamente em: `mongodb://localhost:27017`

---

### 2️⃣ Obter Chave da OpenAI 🤖

**Passos:**

1. Acesse: https://platform.openai.com/signup
2. Crie uma conta (se ainda não tiver)
3. Vá em: https://platform.openai.com/api-keys
4. Clique em "Create new secret key"
5. Copie a chave (começa com `sk-...`)
6. **IMPORTANTE:** Adicione créditos na conta (mínimo $5)

**Custo estimado:**
- GPT-4o-mini: ~$0.15 por 1000 requisições
- Para testes: $5 dura bastante tempo

---

### 3️⃣ Criar Arquivo `.env`

Crie o arquivo `c:\Projetos\NovaFitness\server\.env` com o seguinte conteúdo:

```env
# MongoDB - Escolha UMA das opções:

# Opção A: MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://usuario:senha@cluster0.xxxxx.mongodb.net/novafitness

# Opção B: MongoDB Local (descomente se usar local)
# MONGODB_URI=mongodb://localhost:27017/novafitness

# OpenAI API Key (obrigatório)
OPENAI_API_KEY=sk-sua-chave-aqui

# Porta do servidor
PORT=5000
```

**⚠️ IMPORTANTE:**
- Substitua `usuario:senha@cluster0.xxxxx` pelos seus dados do Atlas
- OU use `mongodb://localhost:27017/novafitness` se instalou local
- Substitua `sk-sua-chave-aqui` pela sua chave OpenAI real

---

## 🚀 Próximos Passos

Após configurar o `.env`:

### 1. Testar Backend

```bash
cd c:\Projetos\NovaFitness\server
npm run dev
```

**Você deve ver:**
```
🚀 Servidor rodando na porta 5000
📍 http://localhost:5000
✅ MongoDB conectado: ...
```

### 2. Testar Frontend (em outro terminal)

```bash
cd c:\Projetos\NovaFitness\client
npm run dev
```

**Você deve ver:**
```
VITE v5.x.x ready in xxx ms
➜ Local: http://localhost:5173/
```

### 3. Acessar o Sistema

Abra o navegador em: **http://localhost:5173**

---

## 🧪 Teste Rápido da API

Após iniciar o backend, teste se está funcionando:

**No navegador, acesse:**
```
http://localhost:5000/api/health
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "NovaFitness API está funcionando! 💪",
  "timestamp": "2024-12-01T..."
}
```

---

## ❌ Troubleshooting

### Erro: "MongoDB connection failed"

**Solução:**
- Verifique se a URI no `.env` está correta
- Se usar Atlas, confirme que adicionou `0.0.0.0/0` no Network Access
- Teste a conexão em: https://www.mongodb.com/products/compass

### Erro: "OpenAI API key invalid"

**Solução:**
- Verifique se copiou a chave completa (começa com `sk-`)
- Confirme que tem créditos na conta OpenAI
- Teste a chave em: https://platform.openai.com/playground

### Erro: "Port 5000 already in use"

**Solução:**
- Mude a porta no `.env` para `PORT=5001`
- Ou finalize o processo que está usando a porta 5000

---

## 📝 Checklist de Configuração

- [ ] Escolhi opção de MongoDB (Atlas ou Local)
- [ ] Criei conta no MongoDB Atlas OU instalei MongoDB local
- [ ] Obtive connection string do MongoDB
- [ ] Criei conta na OpenAI
- [ ] Obtive API key da OpenAI
- [ ] Adicionei créditos na conta OpenAI
- [ ] Criei arquivo `.env` com as configurações
- [ ] Testei backend com `npm run dev`
- [ ] Testei frontend com `npm run dev`
- [ ] Acessei http://localhost:5173 no navegador

---

## 💡 Dica

Use **MongoDB Atlas** se quiser começar rápido sem instalar nada. É grátis e funciona perfeitamente para desenvolvimento e produção!

---

**Precisa de ajuda?** Me avise qual opção você escolheu e posso te ajudar com a configuração! 🚀
