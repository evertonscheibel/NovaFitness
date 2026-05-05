# 🚀 Guia Rápido: MongoDB para NovaFitness

## ✅ Você disse que tem o MongoDB Compass rodando

Se o **MongoDB Compass está aberto e conectado**, então o MongoDB está rodando! 🎉

---

## 📝 Passo 1: Verificar a Conexão no Compass

No MongoDB Compass, verifique qual URI você está usando para conectar:

### Opção A: Conectado SEM Replica Set
Se você vê algo como:
```
mongodb://localhost:27017
```

➡️ **Você precisa configurar como Replica Set**

### Opção B: Conectado COM Replica Set  
Se você vê algo como:
```
mongodb://localhost:27017/?replicaSet=rs0
```

➡️ **Perfeito! Já está configurado!**

---

## 🔧 Passo 2: Configurar Replica Set (se necessário)

### Se você ainda NÃO tem Replica Set configurado:

1. **Abra o MongoDB Compass**
2. **Clique em "Open MongoDB Shell" (MONGOSH)** (ícone >_ no canto inferior esquerdo)
3. **Cole e execute este comando:**

```javascript
rs.initiate({
  _id: "rs0",
  members: [{ _id: 0, host: "localhost:27017" }]
})
```

4. **Você deve ver uma resposta:**
```json
{ "ok": 1 }
```

✅ **Pronto! Replica Set configurado!**

---

## 📁 Passo 3: Verificar o arquivo .env

O arquivo já está configurado em:
```
c:\Projetos\NovaFitness\server\.env
```

Com:
```env
DATABASE_URL=mongodb://localhost:27017/novafitness?replicaSet=rs0
```

---

## ✅ Passo 4: Testar a Conexão

1. **Abra um terminal** em `c:\Projetos\NovaFitness\server`

2. **Execute:**
```bash
npm run test:db
```

3. **Se der erro**, execute primeiro:
```bash
npx prisma generate
npm run test:db
```

---

## 🎯 Passo 5: Iniciar o Servidor

```bash
npm run dev
```

---

## ⚠️ Problemas Comuns

### "MongoServerError: Transaction numbers are only allowed on a replica set member"
➡️ Execute o comando `rs.initiate()` no MongoDB Shell (Passo 2)

### "PrismaClientInitializationError"
➡️ Execute `npx prisma generate`

### "ECONNREFUSED"
➡️ O MongoDB não está rodando. Abra o MongoDB Compass e conecte primeiro

---

## 🆘 Atalho Total

Se quiser fazer tudo de uma vez:

```bash
# 1. Gerar Prisma Client
npx prisma generate

# 2. Testar conexão
npm run test:db

# 3. Iniciar servidor
npm run dev
```
