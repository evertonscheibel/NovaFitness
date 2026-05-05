# 🚀 Guia de Migração e Instalação do NovaFitness

Este guia orienta como mover o sistema NovaFitness de uma máquina para outra, garantindo que todas as dependências e configurações sejam mantidas.

---

## 📦 1. Preparando os Arquivos

1. **Limpeza**: Antes de mover, você pode apagar as pastas `node_modules` para diminuir o tamanho do arquivo (elas serão reinstaladas no destino).
2. **Compactação**: Compacte a pasta `NovaFitness` em um arquivo `.zip` ou suba para um repositório Git privado.

---

## 🛠️ 2. Instalação na Nova Máquina

### Pré-requisitos
Certifique-se de ter instalado:
- **Node.js** (v18 ou superior)
- **MongoDB Community Server** (ou use MongoDB Atlas na nuvem)
- **Git** (opcional)

### Passo a Passo

#### 1. Extrair os Arquivos
Extraia o sistema na pasta de sua preferência (Ex: `C:\NovaFitness`).

#### 2. Configurar o Banco de Dados (MongoDB)
O sistema precisa do MongoDB com **Replica Set** ativado para suportar transações da Prisma.

- **Opção A (Fácil):** Use o Docker.
  ```bash
  docker-compose up -d
  ```
- **Opção B (Manual):** Execute o script de configuração como Administrador:
  ```powershell
  .\configure-mongo-replicaset.ps1
  ```

#### 3. Configurar Variáveis de Ambiente (.env)
Você precisa criar os arquivos `.env` baseados nos exemplos:

- **Servidor (`server/.env`)**:
  ```env
  PORT=5000
  DATABASE_URL="mongodb://localhost:27017/novafitness?replicaSet=rs0"
  IA_PROVIDER=groq
  GROQ_API_KEY=sua_chave_aqui
  ```
- **Frontend (`client/.env`)**:
  ```env
  VITE_API_URL=http://localhost:5000/api
  ```
- **Mobile (`mobile/.env`)**:
  ```env
  API_BASE=http://seu-ip-local:5000/api
  ```

#### 4. Instalar Dependências e Inicializar
Abra um terminal na pasta raiz e execute:

```powershell
# Instalar dependências
cd server; npm install
cd ../client; npm install
cd ../mobile; npm install

# Inicializar o Banco de Dados com Prisma
cd ../server
npx prisma generate
npx prisma db push
```

---

## 🚀 3. Executando o Sistema

### Modo Desenvolvimento
Use o script unificado na raiz:
```bash
.\iniciar-sistema.bat
```

### Modo Produção (Recomendado para uso real)
1. **Frontend**: Gere o build otimizado.
   ```bash
   cd client
   npm run build
   ```
   *Os arquivos estarão na pasta `dist`. Você pode servi-los usando Nginx ou o próprio backend.*

2. **Backend**:
   ```bash
   cd server
   npm start
   ```

---

## ⚠️ Checklist de Migração

- [ ] Verificou se o IP no `mobile/.env` é o IP atual da máquina na rede?
- [ ] O MongoDB está rodando com Replica Set?
- [ ] As chaves de API (Groq/OpenAI) foram copiadas para o novo `.env`?
- [ ] A pasta `uploads/` e `imagens/` foram movidas junto com o sistema?

---

**Suporte**: Em caso de erros de conexão, execute `npm run test:db` na pasta `server` para diagnóstico.
