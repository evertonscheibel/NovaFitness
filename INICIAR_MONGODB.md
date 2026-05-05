# 🚀 SOLUÇÃO RÁPIDA - Iniciar MongoDB

## ⚡ Passo ÚNICO - Execute como Administrador

1. **Abra o PowerShell como Administrador**
   - Pressione `Win + X`
   - Escolha "Windows PowerShell (Admin)" ou "Terminal (Admin)"

2. **Cole e execute este comando:**

```powershell
cd C:\Projetos\NovaFitness
.\configure-mongo-replicaset-FIXED.ps1
```

3. **Aguarde a mensagem** e **pressione ENTER** quando solicitado

---

## ✅ O que o script faz automaticamente:

1. ✅ Para o serviço MongoDB
2. ✅ Faz backup da configuração atual
3. ✅ Configura o MongoDB como Replica Set
4. ✅ Inicia o serviço MongoDB
5. ✅ Inicializa o Replica Set
6. ✅ Testa a conexão

---

## 🎯 Após executar o script:

Volte para este terminal normal e execute:

```bash
cd c:\Projetos\NovaFitness\server

# Testar conexão
npm run test:db

# Iniciar servidor
npm run dev
```

---

## ⚠️ Se der erro de permissão:

Execute este comando PRIMEIRO no PowerShell Admin:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Depois execute o script novamente.

---

## 🆘 Alternativa Manual (se o script não funcionar):

### Passo 1: Iniciar MongoDB manualmente

```powershell
# Como Administrador
Start-Service MongoDB
```

### Passo 2: Conectar no MongoDB Compass

1. Abra MongoDB Compass
2. Cole esta URI:
   ```
   mongodb://localhost:27017
   ```
3. Clique em "Connect"

### Passo 3: Inicializar Replica Set

No MongoDB Compass:
1. Clique no ícone `>_` (MONGOSH) no canto inferior
2. Cole e execute:
   ```javascript
   rs.initiate({
     _id: "rs0",
     members: [{ _id: 0, host: "localhost:27017" }]
   })
   ```
3. Aguarde ver `{ "ok": 1 }`
4. Desconecte e reconecte usando:
   ```
   mongodb://localhost:27017/?replicaSet=rs0
   ```

---

## 📝 RESUMO

**MAIS FÁCIL:** Execute o script como Admin → Pronto!  
**ALTERNATIVA:** Inicie manualmente o MongoDB → Configure Replica Set no Compass
