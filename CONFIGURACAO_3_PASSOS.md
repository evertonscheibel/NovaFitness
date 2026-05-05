# ⚡ Configuração MongoDB Local em 3 Passos

## Passo 1: Configurar MongoDB como Replica Set

O NovaFitness precisa do MongoDB configurado como Replica Set. Você tem **2 opções**:

### Opção A: Docker (Recomendado - Mais Fácil)

```bash
# No diretório do projeto
cd c:\Projetos\NovaFitness
docker-compose up -d
```

### Opção B: MongoDB Instalado Localmente

Execute como **Administrador**:
```powershell
cd c:\Projetos\NovaFitness
.\configure-mongo-replicaset.ps1
```

Depois inicialize o Replica Set:
```bash
node c:\Projetos\NovaFitness\server\init-replica.js
```

---

## Passo 2: Configurar o arquivo .env

**Crie o arquivo** (se não existir):
```
c:\Projetos\NovaFitness\server\.env
```

**Cole o seguinte conteúdo:**
```env
MONGODB_URI=mongodb://localhost:27017/novafitness?replicaSet=rs0
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=sua_chave_openai_aqui
```

> **📝 Nota:** Se usou Docker, a URI já está correta. Se instalou localmente, confirme que o MongoDB está rodando na porta 27017.

---

## Passo 3: Testar a Conexão

```bash
cd c:\Projetos\NovaFitness\server
npm run test:db
```

✅ **Pronto!** Se o teste passar, execute:
```bash
npm run dev
```

---

## 🔧 Verificar com MongoDB Compass

1. Abra o **MongoDB Compass**
2. Conecte em: `mongodb://localhost:27017/?replicaSet=rs0`
3. Você deve ver o banco `novafitness` sendo criado

---

## ⚠️ Problemas Comuns

### "MongoServerError: Transaction numbers"
→ O MongoDB não está configurado como Replica Set. Execute a Opção A ou B do Passo 1

### "ECONNREFUSED 127.0.0.1:27017"
→ O MongoDB não está rodando. Inicie com `docker-compose up -d` ou verifique o serviço Windows

### "MONGODB_URI não encontrada"
→ Verifique se o arquivo `.env` está em `server/.env` (não na raiz do projeto)

### MongoDB Compass não conecta
→ Use a URI completa: `mongodb://localhost:27017/?replicaSet=rs0`
