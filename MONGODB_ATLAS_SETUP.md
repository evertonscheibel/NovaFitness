# 🚀 Guia de Configuração: MongoDB Atlas

Este guia irá orientá-lo na configuração do MongoDB Atlas para o sistema NovaFitness.

## 📋 Pré-requisitos

- Conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuita disponível)
- Acesso à internet

---

## 1️⃣ Criar Conta e Cluster no MongoDB Atlas

### 1.1 Criar Conta
1. Acesse [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Crie sua conta usando email ou Google/GitHub
3. Faça login no MongoDB Atlas

### 1.2 Criar Organização e Projeto
1. Após o login, você será solicitado a criar uma organização
2. Nome sugerido: `NovaFitness` ou nome da sua empresa
3. Crie um novo projeto dentro da organização
4. Nome sugerido: `NovaFitness-Production` ou `NovaFitness-Dev`

### 1.3 Criar Cluster (Banco de Dados)

1. Clique em **"Build a Database"** ou **"Create"**
2. Escolha o plano:
   - **M0 (FREE)**: Ideal para desenvolvimento e testes
     - 512 MB de armazenamento
     - Compartilhado
     - Sem custo
   - **M10+**: Para produção com mais recursos

3. Configurações do Cluster:
   - **Provider**: AWS, Google Cloud ou Azure (escolha o mais próximo)
   - **Region**: Escolha a região mais próxima do Brasil
     - AWS: `sa-east-1` (São Paulo)
     - Google Cloud: `southamerica-east1` (São Paulo)
     - Azure: `brazilsouth` (São Paulo)
   - **Cluster Name**: `NovaFitness-Cluster` ou nome de sua preferência

4. Clique em **"Create Cluster"**
   - ⏱️ O cluster levará 3-5 minutos para ser criado

---

## 2️⃣ Configurar Acesso ao Banco de Dados

### 2.1 Criar Usuário do Banco de Dados

1. No menu lateral, clique em **"Database Access"**
2. Clique em **"Add New Database User"**
3. Configurações:
   - **Authentication Method**: Password
   - **Username**: `novafitness-admin` (ou nome de sua preferência)
   - **Password**: Clique em **"Autogenerate Secure Password"** e **copie a senha**
     - ⚠️ **IMPORTANTE**: Salve esta senha em local seguro!
   - **Database User Privileges**: 
     - Selecione **"Read and write to any database"**
     - Ou crie privilégios customizados se preferir
4. Clique em **"Add User"**

### 2.2 Configurar Network Access (Lista de IPs)

1. No menu lateral, clique em **"Network Access"**
2. Clique em **"Add IP Address"**
3. Opções:
   
   **Opção A - Desenvolvimento (Permitir de qualquer lugar):**
   - Clique em **"Allow Access from Anywhere"**
   - IP: `0.0.0.0/0`
   - ⚠️ **Atenção**: Menos seguro, use apenas para desenvolvimento
   
   **Opção B - Produção (IP Específico):**
   - Clique em **"Add Current IP Address"** para adicionar seu IP atual
   - Ou insira manualmente o IP do seu servidor
   - Para múltiplos IPs, repita o processo

4. Adicione um comentário descritivo (ex: "Servidor de Produção")
5. Clique em **"Confirm"**

---

## 3️⃣ Obter String de Conexão

### 3.1 Acessar Connection String

1. Volte para **"Database"** no menu lateral
2. Localize seu cluster e clique em **"Connect"**
3. Escolha **"Connect your application"**
4. Configurações:
   - **Driver**: Node.js
   - **Version**: 5.5 or later (ou a versão mais recente)

### 3.2 Copiar e Configurar a URI

Você verá uma string similar a esta:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Personalize a string:**

1. Substitua `<username>` pelo usuário criado (ex: `novafitness-admin`)
2. Substitua `<password>` pela senha do usuário
   - ⚠️ Se a senha contém caracteres especiais, use URL encoding:
     - `@` → `%40`
     - `#` → `%23`
     - `$` → `%24`
     - `%` → `%25`
3. Adicione o nome do banco de dados após `.mongodb.net/`:
   ```
   mongodb+srv://novafitness-admin:SuaSenha123@cluster0.xxxxx.mongodb.net/novafitness?retryWrites=true&w=majority
   ```

**String de Conexão Final:**
```
mongodb+srv://novafitness-admin:SuaSenha123@novafitness-cluster.abc123.mongodb.net/novafitness?retryWrites=true&w=majority&appName=NovaFitness
```

---

## 4️⃣ Armazenar Credenciais no Google Cloud Secret Manager

### 4.1 Criar Secret no Google Cloud

1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Selecione seu projeto ou crie um novo
3. No menu lateral, navegue para **"Security" → "Secret Manager"**
4. Se for a primeira vez, clique em **"Enable Secret Manager API"**
5. Clique em **"Create Secret"**

### 4.2 Configurar o Secret

1. **Name**: `MONGODB_URI`
2. **Secret value**: Cole a string de conexão completa do MongoDB Atlas
   ```
   mongodb+srv://novafitness-admin:SuaSenha123@cluster0.xxxxx.mongodb.net/novafitness?retryWrites=true&w=majority
   ```
3. **Regions**: Selecione a região mais próxima (ex: `southamerica-east1`)
4. Clique em **"Create Secret"**

### 4.3 Configurar Permissões

1. Após criar o secret, clique na aba **"Permissions"**
2. Clique em **"Grant Access"**
3. **New principals**: Adicione o service account que sua aplicação usará
   - Formato: `service-account-name@project-id.iam.gserviceaccount.com`
4. **Role**: Selecione **"Secret Manager Secret Accessor"**
5. Clique em **"Save"**

---

## 5️⃣ Criar Service Account do Google Cloud

### 5.1 Criar Service Account

1. No Google Cloud Console, navegue para **"IAM & Admin" → "Service Accounts"**
2. Clique em **"Create Service Account"**
3. Configurações:
   - **Service account name**: `novafitness-backend`
   - **Service account ID**: `novafitness-backend` (gerado automaticamente)
   - **Description**: `Service account para backend NovaFitness acessar Secret Manager`
4. Clique em **"Create and Continue"**

### 5.2 Conceder Permissões

1. **Select a role**: 
   - Adicione **"Secret Manager Secret Accessor"**
2. Clique em **"Continue"**
3. Clique em **"Done"**

### 5.3 Criar Chave JSON

1. Na lista de service accounts, localize `novafitness-backend`
2. Clique nos três pontos (⋮) e selecione **"Manage keys"**
3. Clique em **"Add Key" → "Create new key"**
4. Selecione **"JSON"**
5. Clique em **"Create"**
   - Um arquivo JSON será baixado automaticamente
   - ⚠️ **IMPORTANTE**: Guarde este arquivo em local seguro!

### 5.4 Configurar Credenciais no Projeto

1. Crie uma pasta `config` dentro de `server/`:
   ```bash
   mkdir c:\Projetos\NovaFitness\server\config
   ```

2. Mova o arquivo JSON baixado para esta pasta:
   ```
   c:\Projetos\NovaFitness\server\config\gcp-credentials.json
   ```

3. **⚠️ SEGURANÇA**: Adicione ao `.gitignore`:
   ```
   # Google Cloud Credentials
   config/gcp-credentials.json
   *.json
   ```

---

## 6️⃣ Configurar Variáveis de Ambiente

### 6.1 Atualizar arquivo .env

Edite o arquivo `c:\Projetos\NovaFitness\server\.env`:

```env
# Google Cloud
GOOGLE_CLOUD_PROJECT_ID=seu-projeto-id
GOOGLE_APPLICATION_CREDENTIALS=./config/gcp-credentials.json
MONGODB_SECRET_NAME=MONGODB_URI

# Outras configurações
PORT=5000
NODE_ENV=production
```

**Como encontrar o Project ID:**
1. No Google Cloud Console, o Project ID está no topo da página
2. Ou acesse **"IAM & Admin" → "Settings"**

---

## 7️⃣ Testar Conexão

### 7.1 Instalar Dependências

```bash
cd c:\Projetos\NovaFitness\server
npm install
```

### 7.2 Iniciar Servidor

```bash
npm run dev
```

### 7.3 Verificar Logs

Você deve ver mensagens como:
```
🔐 Usando credenciais do Google Cloud: c:\Projetos\NovaFitness\server\config\gcp-credentials.json
✅ Google Cloud Secret Manager configurado para projeto: seu-projeto-id
🔄 Iniciando conexão com MongoDB Atlas...
✅ Credenciais obtidas do Google Cloud Secret Manager
✅ MongoDB Atlas conectado com sucesso!
📍 Host: cluster0-shard-00-01.xxxxx.mongodb.net
📊 Database: novafitness
🔒 SSL/TLS: Ativado
🚀 Servidor rodando na porta 5000
```

---

## 🔧 Troubleshooting

### Erro: "Authentication failed"
- ✅ Verifique se o usuário e senha estão corretos
- ✅ Verifique se a senha foi URL-encoded corretamente
- ✅ Confirme que o usuário tem permissões adequadas

### Erro: "Connection timeout"
- ✅ Verifique se seu IP está na whitelist do MongoDB Atlas
- ✅ Verifique sua conexão com a internet
- ✅ Tente adicionar `0.0.0.0/0` temporariamente para debug

### Erro: "Secret not found"
- ✅ Verifique se o nome do secret está correto (`MONGODB_URI`)
- ✅ Confirme que o service account tem permissão "Secret Manager Secret Accessor"
- ✅ Verifique se o `GOOGLE_CLOUD_PROJECT_ID` está correto

### Erro: "Could not load credentials"
- ✅ Verifique se o caminho do arquivo JSON está correto
- ✅ Confirme que o arquivo JSON existe e é válido
- ✅ Verifique permissões de leitura do arquivo

---

## 📊 Monitoramento

### MongoDB Atlas Dashboard
- Acesse **"Metrics"** para ver:
  - Conexões ativas
  - Operações por segundo
  - Uso de memória e CPU
  - Latência de rede

### Google Cloud Audit Logs
- Acesse **"Logging" → "Logs Explorer"**
- Filtre por: `resource.type="secretmanager.googleapis.com/Secret"`
- Veja todos os acessos aos secrets

---

## 🔒 Boas Práticas de Segurança

1. **Nunca commite credenciais** no Git
2. **Rotacione senhas** regularmente (a cada 90 dias)
3. **Use IPs específicos** em produção (evite 0.0.0.0/0)
4. **Monitore acessos** via audit logs
5. **Ative autenticação de dois fatores** no MongoDB Atlas e Google Cloud
6. **Use diferentes credenciais** para desenvolvimento e produção
7. **Faça backups regulares** do banco de dados

---

## ✅ Checklist Final

- [ ] Cluster MongoDB Atlas criado
- [ ] Usuário do banco de dados criado
- [ ] IP adicionado à whitelist
- [ ] String de conexão obtida e testada
- [ ] Secret criado no Google Cloud Secret Manager
- [ ] Service account criado com permissões corretas
- [ ] Arquivo JSON de credenciais baixado e configurado
- [ ] Variáveis de ambiente configuradas no .env
- [ ] Dependências instaladas (`npm install`)
- [ ] Conexão testada com sucesso
- [ ] Credenciais adicionadas ao .gitignore

---

## 📚 Recursos Adicionais

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Google Cloud Secret Manager](https://cloud.google.com/secret-manager/docs)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Node.js MongoDB Driver](https://mongodb.github.io/node-mongodb-native/)
