# 💪 NovaFitness AI Trainer

Sistema completo de gerenciamento de treinos com IA integrada. Permite cadastro de alunos, geração automática de treinos personalizados usando IA, aprovação por treinadores, área do aluno com PWA/Mobile, e geração de PDFs.

## 🚀 Tecnologias

### Backend
- **Node.js** + **Express** + **TypeScript** - Servidor e API REST
- **MongoDB** + **Prisma ORM** - Banco de dados
- **OpenAI API / Groq** - Geração de treinos com IA
- **PDFKit** - Geração de PDFs

### Frontend Web
- **React 18** + **Vite** - Interface do usuário
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **Recharts** - Gráficos de evolução
- **PWA-ready** - Instalável como aplicativo

### Mobile
- **Expo** (React Native) + **TypeScript** - App nativo
- **Lucide React Native** - Ícones

## 📱 Estrutura do Projeto

```
NovaFitness/
├── server/          # Backend (Node.js + Express + TypeScript)
├── client/          # Frontend Web (React + Vite + Tailwind)
├── mobile/          # App Mobile (Expo + React Native)
├── shared/          # Tipos e utilitários compartilhados
└── MIGRACAO_SISTEMA.md # Guia completo de migração
```

## 📦 Migração para Outra Máquina

Se você deseja levar este sistema para outro computador, siga o guia completo:
👉 **[Guia de Migração](./MIGRACAO_SISTEMA.md)**

### Preparação Rápida
Execute o script na raiz para preparar os arquivos para o ZIP:
```powershell
.\PREPARAR_MIGRACAO.ps1
```

## 🔧 Instalação e Execução

### Pré-requisitos
- Node.js 18+
- MongoDB (local ou Atlas)

### Backend

```bash
cd server
npm install
cp .env.example .env  # Configure suas variáveis
npm run prisma:generate
npm run seed  # Popula o banco com dados de teste
npm run dev
```

O servidor estará rodando em: `http://localhost:5000`

### Deploy no Render
- **Health Check Path**: Defina como `/health` nas configurações do Render.
- **Environment Variables**:
  - `PORT`: (Injetado automaticamente pelo Render)
  - `NODE_ENV`: `production`
  - `CORS_ORIGINS`: Lista separada por vírgula dos domínios permitidos.
  - `DATABASE_URL`: URL de conexão do MongoDB Atlas.

### Frontend Web

```bash
cd client
npm install
npm run dev
```

O frontend estará rodando em: `http://localhost:5173`

### Mobile (Expo)

```bash
cd mobile
npm install
npx expo start
```

Escaneie o QR Code com o app Expo Go no seu celular.

## 📋 Variáveis de Ambiente (.env)

```env
# MongoDB
DATABASE_URL=mongodb://localhost:27017/novafitness?replicaSet=rs0

# Servidor
PORT=5000

# IA Provider: 'mock' (gratuito) ou 'openai' (requer chave)
IA_PROVIDER=mock
OPENAI_API_KEY=sua_chave_openai  # Opcional

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# URL base para links de acesso
APP_BASE_URL=http://localhost:5173
```

## 🎯 Fluxos Principais

### 1. Cadastro de Aluno
1. Treinador cadastra aluno com anamnese
2. Sistema gera sugestão de treino via IA
3. Status: `Pendente`

### 2. Aprovação de Treino
1. Treinador revisa sugestão
2. Aprova ou ajusta exercícios
3. Treino se torna `Vigente`

### 3. Publicação para Aluno
1. Treinador publica treino
2. Sistema cria snapshot imutável (WorkoutPublication)
3. Gera token de acesso seguro

### 4. Área do Aluno (Web/Mobile)
- Acesso via token (não expõe IDs)
- Visualiza treino de hoje
- **PREMIUM**: Registra execução (FEITO/NÃO FIZ/SUBSTITUI)
- **PREMIUM**: Acompanha evolução (peso, medidas, energia)

## 🔌 API Endpoints

### Student Area (Token-based)
- `POST /api/student-area/link/:studentId` - Gera token
- `GET /api/student-area/by-token/:token` - Perfil + treino

### Publications
- `POST /api/publications/publish` - Publica treino
- `GET /api/publications/student/:studentId` - Lista publicações

### Logs (PREMIUM)
- `POST /api/logs/exercise` - Registra execução
- `GET /api/logs/me?from=&to=` - Histórico

### Progress (PREMIUM)
- `POST /api/progress/me` - Registra evolução
- `GET /api/progress/me?from=&to=` - Histórico

### Manager AI Copilot
- `POST /api/manager-ai/summary-week` - Resumo semanal
- `POST /api/manager-ai/risk-dropout` - Risco de abandono
- `POST /api/manager-ai/retention-plan` - Plano de retenção

## 🧪 Dados de Teste

Após rodar `npm run seed`, você terá:
- 10 exercícios no catálogo
- 2 alunos: BASE e PREMIUM
- 1 treino publicado
- Tokens de acesso:
  - BASE: `demo-token-base-001`
  - PREMIUM: `demo-token-premium-001`

## 🔒 Planos (BASE vs PREMIUM)

| Funcionalidade | BASE | PREMIUM |
|---------------|------|---------|
| Ver treino | ✅ | ✅ |
| Gerar PDF | ✅ | ✅ |
| Registrar logs | ❌ | ✅ |
| Acompanhar evolução | ❌ | ✅ |
| PRs (recordes) | ❌ | ✅ |

## 📝 Licença

MIT

---

**🎯 Powered by AI | NovaFitness 2024 💪**
