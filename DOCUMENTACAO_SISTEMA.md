# 📘 NovaFitness AI Trainer — Documentação Completa do Sistema

> **Versão:** 1.0.0  
> **Última atualização:** 13 de Fevereiro de 2026  
> **Tipo:** SaaS — Sistema de Gestão de Academia com Inteligência Artificial

---

## 📌 Sumário

1. [Objetivo do Sistema](#1-objetivo-do-sistema)
2. [Arquitetura Geral](#2-arquitetura-geral)
3. [Linguagens e Tecnologias](#3-linguagens-e-tecnologias)
4. [Estrutura de Diretórios](#4-estrutura-de-diretórios)
5. [Módulos e Funcionalidades](#5-módulos-e-funcionalidades)
   - 5.1 [Gestão de Alunos](#51-gestão-de-alunos)
   - 5.2 [Geração de Treinos com IA](#52-geração-de-treinos-com-ia)
   - 5.3 [Revisão e Aprovação do Treinador](#53-revisão-e-aprovação-do-treinador)
   - 5.4 [Catálogo de Exercícios](#54-catálogo-de-exercícios)
   - 5.5 [Sistema de Publicação de Treinos](#55-sistema-de-publicação-de-treinos)
   - 5.6 [Área do Aluno (App Web)](#56-área-do-aluno-app-web)
   - 5.7 [Logs de Execução e Evolução](#57-logs-de-execução-e-evolução)
   - 5.8 [Records Pessoais (PRs)](#58-records-pessoais-prs)
   - 5.9 [Check-in de Presença](#59-check-in-de-presença)
   - 5.10 [Gestão Financeira](#510-gestão-financeira)
   - 5.11 [Dashboard do Gestor](#511-dashboard-do-gestor)
   - 5.12 [Hub de Gestão com IA](#512-hub-de-gestão-com-ia)
   - 5.13 [Geração de PDF de Treino](#513-geração-de-pdf-de-treino)
   - 5.14 [Mensagens Aluno → Treinador](#514-mensagens-aluno--treinador)
6. [Modelo de Dados (Schema Prisma)](#6-modelo-de-dados-schema-prisma)
7. [API REST — Endpoints](#7-api-rest--endpoints)
8. [Autenticação e Segurança](#8-autenticação-e-segurança)
9. [Variáveis de Ambiente](#9-variáveis-de-ambiente)
10. [Como Executar](#10-como-executar)

---

## 1. Objetivo do Sistema

O **NovaFitness AI Trainer** é uma plataforma SaaS completa para gestão de academias e studios de personal training. Seu diferencial é a **geração automática de treinos personalizados por Inteligência Artificial**, combinada com ferramentas modernas de gestão operacional.

### Problemas que resolve

| Problema | Solução NovaFitness |
|----------|---------------------|
| Tempo gasto criando fichas de treino | IA gera treinos completos em segundos |
| Fichas de papel que se perdem | Área do Aluno digital com acesso por token |
| Falta de controle da evolução | Logs de execução + gráficos de evolução |
| Alunos abandonando a academia | IA detecta risco de abandono e sugere retenção |
| Gestão financeira desorganizada | Módulo financeiro integrado com status de pagamento |
| Controle de presença manual | Sistema de check-in digital |

### Público-alvo

- **Personal Trainers** que desejam automatizar a criação de treinos
- **Academias de pequeno e médio porte** que buscam modernizar a gestão
- **Studios de treinamento** que querem oferecer diferencial tecnológico

---

## 2. Arquitetura Geral

O sistema segue uma arquitetura **monolítica modular** com separação clara entre frontend e backend:

```
┌──────────────────────────────────────────────────────┐
│                     FRONTEND                         │
│            React 18 + Vite + TailwindCSS             │
│               (SPA - Single Page App)                │
└──────────────────┬───────────────────────────────────┘
                   │ HTTP/REST (Axios)
                   ▼
┌──────────────────────────────────────────────────────┐
│                     BACKEND                          │
│              Express.js (Node.js)                    │
│            JavaScript ES Modules (.js)               │
│                                                      │
│  ┌─────────┐  ┌────────────┐  ┌──────────────────┐  │
│  │ Routes  │→ │Controllers │→ │    Services      │  │
│  └─────────┘  └────────────┘  └──────────────────┘  │
│                                       │              │
│                               ┌───────┴───────┐     │
│                               │  Prisma ORM   │     │
│                               └───────┬───────┘     │
└───────────────────────────────────────┼──────────────┘
                                        │
                   ┌────────────────────┼────────────────┐
                   │        MongoDB (Banco de Dados)     │
                   └─────────────────────────────────────┘
                                        │
                   ┌────────────────────┼────────────────┐
                   │    Groq Cloud (LLaMA 3.3 70B)       │
                   │    OpenAI GPT-4o-mini (Manager AI)  │
                   └─────────────────────────────────────┘
```

### Camadas do Backend

| Camada | Responsabilidade | Exemplo |
|--------|-----------------|---------|
| **Routes** | Definição de endpoints HTTP e validação básica | `student_area.routes.js` |
| **Controllers** | Orquestração da lógica de negócio | `student.controller.js` |
| **Services** | Lógica de negócio reutilizável e integrações | `ai.service.js`, `publication.service.js` |
| **Middleware** | Autenticação, autorização, upload de arquivos | `auth.middleware.js` |
| **Utils** | Funções utilitárias compartilhadas | `helpers.js` (unwrapPrescricao) |

---

## 3. Linguagens e Tecnologias

### 3.1 Linguagens de Programação

| Linguagem | Uso | Versão |
|-----------|-----|--------|
| **JavaScript (ES Modules)** | Backend completo (Node.js) | ES2022+ |
| **JavaScript (JSX)** | Frontend (React) | ES2022+ |
| **CSS (Tailwind + Vanilla)** | Estilização do frontend | CSS3 |
| **Prisma Schema Language** | Definição do modelo de dados | Prisma 5 |

### 3.2 Framework e Bibliotecas — Backend

| Tecnologia | Versão | Função |
|------------|--------|--------|
| **Node.js** | 20+ | Runtime JavaScript |
| **Express.js** | 4.18 | Framework web HTTP |
| **Prisma ORM** | 5.22 | ORM para MongoDB |
| **Groq SDK** | 0.37 | Cliente para API Groq (LLaMA 3.3) |
| **OpenAI SDK** | 4.104 | Cliente para GPT-4o-mini (Manager AI) |
| **PDFKit** | 0.14 | Geração de PDFs de treino |
| **QRCode** | 1.5 | Geração de QR codes nos PDFs |
| **Multer** | 2.0 | Upload de imagens de exercícios |
| **CORS** | 2.8 | Configuração de CORS |
| **dotenv** | 16.3 | Variáveis de ambiente |
| **crypto** | nativo | Geração de tokens seguros |

### 3.3 Framework e Bibliotecas — Frontend

| Tecnologia | Versão | Função |
|------------|--------|--------|
| **React** | 18.2 | Biblioteca UI |
| **Vite** | 5.0 | Bundler e dev server |
| **React Router DOM** | 6.20 | Roteamento SPA |
| **Axios** | 1.6 | Cliente HTTP |
| **Lucide React** | 0.562 | Ícones SVG |
| **Recharts** | 3.6 | Gráficos e visualizações |
| **TailwindCSS** | 3.4 | Framework CSS utilitário |

### 3.4 Infraestrutura

| Tecnologia | Função |
|------------|--------|
| **MongoDB** | Banco de dados NoSQL (documentos JSON) |
| **Docker Compose** | Orquestração do MongoDB (opcional) |
| **Groq Cloud** | Provedor de IA (LLaMA 3.3 70B Versatile) |
| **OpenAI Cloud** | Provedor de IA secundário (GPT-4o-mini para gestão) |

---

## 4. Estrutura de Diretórios

```
NovaFitness/
│
├── client/                          # Frontend React
│   ├── src/
│   │   ├── pages/                   # 22 páginas/componentes de tela
│   │   │   ├── Dashboard.jsx        # Dashboard principal do gestor
│   │   │   ├── RegisterForm.jsx     # Cadastro de alunos
│   │   │   ├── StudentList.jsx      # Lista de alunos
│   │   │   ├── StudentProfile.jsx   # Perfil detalhado do aluno
│   │   │   ├── StudentEdit.jsx      # Edição de dados do aluno
│   │   │   ├── TrainerReview.jsx    # Revisão de sugestões de treino
│   │   │   ├── WorkoutBuilder.jsx   # Construtor manual de treinos
│   │   │   ├── WorkoutList.jsx      # Lista de treinos
│   │   │   ├── WorkoutDetail.jsx    # Detalhes de um treino
│   │   │   ├── WorkoutPDF.jsx       # Visualização de PDF
│   │   │   ├── ExerciseCatalog.jsx  # Catálogo de exercícios
│   │   │   ├── FinancialPage.jsx    # Gestão financeira
│   │   │   ├── CheckInPage.jsx      # Check-in de presença
│   │   │   ├── ManagementHub.jsx    # Hub de gestão/IA
│   │   │   ├── StudentLogin.jsx     # Login do aluno por token
│   │   │   ├── StudentArea.jsx      # Área do aluno (por ID)
│   │   │   ├── StudentAreaLayout.jsx    # Layout base da área do aluno
│   │   │   ├── StudentAreaDashboard.jsx # Dashboard do aluno
│   │   │   ├── StudentAreaWorkouts.jsx  # Treinos do aluno
│   │   │   ├── StudentAreaEvolution.jsx # Gráficos de evolução
│   │   │   └── StudentAreaToken.jsx     # Área do aluno (por token)
│   │   ├── services/
│   │   │   └── api.js               # Centralização de chamadas API (Axios)
│   │   └── App.jsx                  # Componente raiz + rotas
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # Backend Express.js
│   ├── src/
│   │   ├── app.js                   # Ponto de entrada do servidor
│   │   ├── db.js                    # Conexão Prisma/MongoDB
│   │   ├── seed.js                  # Script de seed do banco
│   │   │
│   │   ├── routes/                  # 15 arquivos de rotas
│   │   │   ├── student.routes.js
│   │   │   ├── ai.routes.js
│   │   │   ├── trainer.routes.js
│   │   │   ├── dashboard.routes.js
│   │   │   ├── exercise.routes.js
│   │   │   ├── financial.routes.js
│   │   │   ├── checkin.routes.js
│   │   │   ├── reference.routes.js
│   │   │   ├── workoutPdf.routes.js
│   │   │   ├── student_area.routes.js
│   │   │   ├── publication.routes.js
│   │   │   ├── log.routes.js
│   │   │   ├── pr.routes.js
│   │   │   ├── progress.routes.js
│   │   │   └── manager_ai.routes.js
│   │   │
│   │   ├── controllers/             # 9 controllers
│   │   │   ├── student.controller.js
│   │   │   ├── ai.controller.js
│   │   │   ├── trainer.controller.js
│   │   │   ├── dashboard.controller.js
│   │   │   ├── exercise.controller.js
│   │   │   ├── financial.controller.js
│   │   │   ├── checkin.controller.js
│   │   │   ├── reference.controller.js
│   │   │   └── student_area.controller.js
│   │   │
│   │   ├── services/                # 5 serviços
│   │   │   ├── ai.service.js            # Integração Groq/LLaMA 3.3
│   │   │   ├── publication.service.js   # Publicação de treinos
│   │   │   ├── token.service.js         # Tokens de acesso do aluno
│   │   │   ├── workout.service.js       # Extração de sessões para PDF
│   │   │   └── exerciseCatalog.service.js # Resolução de mídia
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.middleware.js    # Autenticação por token + Premium
│   │   │
│   │   ├── utils/
│   │   │   └── helpers.js           # unwrapPrescricao e utilitários
│   │   │
│   │   ├── pdf/                     # Geração de PDFs
│   │   │   ├── cards/
│   │   │   │   ├── generateWorkoutPdf3col.js  # PDF 3 colunas (layout principal)
│   │   │   │   └── drawExerciseCard.js        # Renderização de cards de exercício
│   │   │   └── assets/              # Fontes e imagens para PDF
│   │   │
│   │   └── scripts/                 # Scripts utilitários
│   │       ├── seedExercises.js
│   │       ├── check-exercises.ts
│   │       ├── dump-data.ts
│   │       └── test-pdf.ts
│   │
│   ├── prisma/
│   │   └── schema.prisma            # Modelo de dados completo
│   └── package.json
│
├── imagens/                         # Imagens de exercícios (upload)
├── uploads/                         # Uploads gerais
├── shared/                          # Módulos compartilhados
└── docker-compose.yml               # MongoDB via Docker
```

---

## 5. Módulos e Funcionalidades

### 5.1 Gestão de Alunos

**Descrição:** CRUD completo de alunos com dados pessoais, anamnese e configurações de plano.

| Funcionalidade | Endpoint | Detalhes |
|---------------|----------|----------|
| Cadastro de aluno | `POST /api/student` | Email auto-gerado se não informado |
| Listar alunos | `GET /api/student` | Com filtros e paginação |
| Perfil detalhado | `GET /api/student/:id` | Inclui treinos e dados de acesso |
| Atualizar dados | `PUT /api/student/:id` | Whitelist de campos permitidos |
| Excluir aluno | `DELETE /api/student/:id` | Cascade em todos os relacionamentos |
| Regenerar token | `POST /api/student/:id/token` | Gera novo token de acesso |

**Campos do Aluno:**
- Nome, telefone, email (auto-gerado), idade, sexo
- Objetivo principal (TAF, Hipertrofia, Emagrecimento, Condicionamento, Força, Saúde)
- Experiência prévia, restrições médicas, frequência semanal
- Plano (BASE/PREMIUM), status (Ativo/Inativo), `has_premium_access`

**Planos:**
- **BASE:** Pode visualizar treinos publicados
- **PREMIUM:** Registrar logs de execução, ver evolução, registrar PRs, enviar mensagens

---

### 5.2 Geração de Treinos com IA

**Descrição:** Geração automática de treinos personalizados usando **Groq Cloud + LLaMA 3.3 70B Versatile**.

**Fluxo:**
```
1. Treinador clica "Novo Treino (IA)" no perfil do aluno
2. Backend envia dados do aluno para a Groq API
3. LLaMA 3.3 gera o treino em formato JSON estruturado
4. Sistema salva como "Sugestão" com status "Pendente"
5. Treinador revisa e aprova/modifica na tela de revisão
```

**Templates de Treino por Sexo:**
- **Homens → Modelo ABC** (3 dias): Peito+Tríceps / Costas+Bíceps / Ombros+Pernas
- **Mulheres → Modelo ABCD** (4 dias): Posterior / Quadríceps / Glúteos / Braços
- **Idosos (60+):** Volume reduzido, prioridade em máquinas

**Regras de Ouro (configuradas no prompt):**
- 5 exercícios por grupamento muscular
- Volume padrão: 3-4 séries, 8-15 repetições
- Descanso: 60-90 segundos

**Modo Mock:** Quando `GROQ_API_KEY` não está configurada, gera treino padrão de teste para não travar o sistema.

---

### 5.3 Revisão e Aprovação do Treinador

**Descrição:** Interface para o treinador revisar, modificar e aprovar sugestões geradas pela IA.

| Funcionalidade | Endpoint | Detalhes |
|---------------|----------|----------|
| Listar sugestões pendentes | `GET /api/trainer/suggestions` | Status: Pendente |
| Aprovar sugestão | `POST /api/trainer/approve/:id` | Cria Workout + Publicação |
| Listar treinos aprovados | `GET /api/trainer/workouts` | Todos os treinos vigentes |
| Editar treino | `PUT /api/trainer/workout/:id` | Modificar prescrição |
| Excluir treino | `DELETE /api/trainer/workout/:id` | Remove treino do sistema |
| Criar treino manual | `POST /api/trainer/workout/manual` | Sem IA, montagem livre |

**Fluxo de aprovação:**
```
Sugestão (Pendente) → Treinador revisa → Aprovação
   → Cria Workout com status "Vigente"
   → Auto-publica (WorkoutPublication) para o aluno
   → PDF disponível para download/impressão
```

---

### 5.4 Catálogo de Exercícios

**Descrição:** Base de dados de exercícios com imagens, vídeos e categorização.

| Funcionalidade | Endpoint | Detalhes |
|---------------|----------|----------|
| Listar exercícios | `GET /api/exercises` | Filtros por grupo muscular, nível, local |
| Criar exercício | `POST /api/exercises` | Validação: nome + grupo obrigatórios |
| Editar exercício | `PUT /api/exercises/:id` | Atualizar campos |
| Excluir exercício | `DELETE /api/exercises/:id` | Soft delete (ativo=false) |
| Upload de imagem | `POST /api/exercises/upload` | Via Multer, salva em `/imagens/` |

**Campos do Exercício:**
- Nome, slug (único), grupo muscular, equipamento
- Nível (Iniciante, Intermediário, Avançado)
- Local (Academia, Casa, Calistenia)
- Imagem URL, Vídeo URL, aliases, descrição

**Tabelas de Referência Dinâmicas:**
- `GET /api/reference/musclegroups` — Grupos musculares ativáveis/desativáveis
- `GET /api/reference/equipment` — Equipamentos ativáveis/desativáveis

---

### 5.5 Sistema de Publicação de Treinos

**Descrição:** Controle de versionamento e distribuição de treinos para alunos.

| Funcionalidade | Endpoint | Detalhes |
|---------------|----------|----------|
| Publicar treino | `POST /api/publications/publish` | Cria snapshot com mídia resolvida |
| Listar publicações do aluno | `GET /api/publications/student/:id` | Histórico com versões |
| Publicação ativa | `GET /api/publications/me/active` | Via token do aluno |
| Detalhes da publicação | `GET /api/publications/:id` | Inclui dados do aluno |

**Mecanismo de Resolução de Mídia:**
Ao publicar um treino, o sistema:
1. Busca cada exercício da prescrição no catálogo
2. Resolve `image_url`, `video_url` e `grupo_muscular`
3. Cria um **snapshot** (cópia) dos dados com mídia embutida
4. O snapshot fica imutável mesmo se o catálogo mudar depois

**Versionamento:** Cada publicação recebe um número de versão incremental.

---

### 5.6 Área do Aluno (App Web)

**Descrição:** Interface mobile-first dedicada ao aluno, acessível via link com token único.

**Acesso:** `https://app.novafitness.com/area-aluno/token/{TOKEN_64_CHARS}`

| Tela | Funcionalidade |
|------|---------------|
| **Dashboard** | Saudação, treino do dia, sessões com exercícios, botões de ação |
| **Treinos** | Histórico de todas as publicações recebidas |
| **Evolução** | Gráficos de aderência, sessões completadas, exercícios feitos vs pulados |
| **Login** | Tela de entrada por token |

**Funcionalidades Premium:**
- Registrar execução (✅ FEITO / ❌ NÃO FIZ / 🔄 SUBSTITUÍ)
- Finalizar sessão completa
- Visualizar gráficos de evolução
- Registrar records pessoais
- Enviar mensagem ao treinador

---

### 5.7 Logs de Execução e Evolução

**Descrição:** Registro detalhado de cada exercício executado pelo aluno (PREMIUM).

| Funcionalidade | Endpoint | Detalhes |
|---------------|----------|----------|
| Registrar log | `POST /api/logs/exercise` | Status + motivo + dor + substituição |
| Meus logs | `GET /api/logs/me` | Filtro por datas |
| Resumo do dia | `GET /api/logs/summary/:date` | Estatísticas consolidadas |
| Evolução do aluno | `GET /api/student-area/evolution/:id` | Dados para gráficos |

**Status de Execução:**
| Status | Descrição |
|--------|-----------|
| `FEITO` | Exercício executado normalmente |
| `NAO_FEITO` | Não executou (requer motivo) |
| `SUBSTITUIDO` | Substituiu por outro exercício (mesmo grupo muscular) |
| `PARCIAL` | Executou parcialmente |

**Motivos de Pulo (SkipReason):**
`DOR`, `TEMPO`, `APARELHO_OCUPADO`, `FALTA_APARELHO`, `CANSACO`, `OUTRO`

**Se motivo = DOR:** Obrigatório informar `painLevel` (0-10)

**Dados de Progresso:**
- Peso corporal, medidas corporais, energia (1-5), qualidade do sono (1-5)
- RPE (percepção de esforço, 1-10), notas, fotos

---

### 5.8 Records Pessoais (PRs)

**Descrição:** Registro de melhores marcas pessoais em cada exercício (PREMIUM).

| Funcionalidade | Endpoint | Detalhes |
|---------------|----------|----------|
| Registrar PR | `POST /api/prs/me` | exerciseId + bestValue |
| Listar meus PRs | `GET /api/prs/me` | Com nome do exercício resolvido |
| Melhor PR por exercício | `GET /api/prs/best` | Última marca registrada por exercício |

---

### 5.9 Check-in de Presença

**Descrição:** Controle de frequência dos alunos na academia.

| Funcionalidade | Endpoint | Detalhes |
|---------------|----------|----------|
| Realizar check-in | `POST /api/checkin` | Por nome ou busca de aluno |
| Listar check-ins | `GET /api/checkin` | Filtro por data |
| Check-ins de hoje | `GET /api/checkin/today` | Lista do dia |

---

### 5.10 Gestão Financeira

**Descrição:** Controle de pagamentos e mensalidades dos alunos.

| Funcionalidade | Endpoint | Detalhes |
|---------------|----------|----------|
| Criar cobrança | `POST /api/financial` | Valor, vencimento, método |
| Listar cobranças | `GET /api/financial` | Filtros por status/período |
| Atualizar status | `PUT /api/financial/:id` | PENDING → PAID / OVERDUE |
| Estatísticas | `GET /api/financial/stats` | Receita, inadimplência |

**Status de Pagamento:** `PENDING`, `PAID`, `OVERDUE`, `CANCELLED`  
**Métodos:** `CREDIT_CARD`, `DEBIT_CARD`, `CASH`, `PIX`, `TRANSFER`

---

### 5.11 Dashboard do Gestor

**Descrição:** Painel principal com métricas e visão geral da academia.

| Funcionalidade | Endpoint | Detalhes |
|---------------|----------|----------|
| Estatísticas gerais | `GET /api/dashboard/stats` | Alunos, treinos, sugestões pendentes |
| Treinos vencendo | `GET /api/dashboard/expiring-workouts` | Alertas de vencimento |
| Dados para gráficos | `GET /api/dashboard/charts` | Séries temporais |

**Métricas exibidas:**
- Total de alunos ativos
- Treinos vigentes
- Sugestões pendentes de aprovação
- Check-ins da semana
- Receita mensal

---

### 5.12 Hub de Gestão com IA

**Descrição:** Módulo de inteligência gerencial usando **OpenAI GPT-4o-mini**.

| Funcionalidade | Endpoint | Detalhes |
|---------------|----------|----------|
| Resumo semanal | `POST /api/manager-ai/summary-week` | Métricas + insights da IA |
| Risco de abandono | `POST /api/manager-ai/risk-dropout` | Identifica alunos inativos |
| Plano de retenção | `POST /api/manager-ai/retention-plan` | Estratégia personalizada por aluno |

**Exemplo — Resumo Semanal:**
A IA analisa: alunos ativos, logs de exercícios, registros de evolução, check-ins, distribuição de status. Retorna insights acionáveis em português.

**Exemplo — Risco de Abandono:**
Identifica alunos sem check-in ou logs nos últimos 14 dias e sugere estratégias de reengajamento personalizadas.

**Modo Mock:** Quando `OPENAI_API_KEY` não está configurada, retorna resposta simulada.

---

### 5.13 Geração de PDF de Treino

**Descrição:** Geração de fichas de treino em PDF com layout profissional de 3 colunas.

| Funcionalidade | Endpoint | Detalhes |
|---------------|----------|----------|
| Gerar PDF | `GET /api/trainer/pdf/:workoutId` | Download direto ou stream |

**Características do PDF:**
- Layout **retrato, 3 colunas** com cards de exercício
- 6-8 cards por página
- Imagem do exercício resolvida do catálogo
- QR Code para acesso à area do aluno
- Nome do aluno, data, treinador
- Cabeçalho com branding NovaFitness

---

### 5.14 Mensagens Aluno → Treinador

**Descrição:** Canal de comunicação do aluno para o gestor/treinador.

| Funcionalidade | Endpoint | Detalhes |
|---------------|----------|----------|
| Enviar mensagem | `POST /api/student-area/message` | Tipos: feedback, question, help |

---

## 6. Modelo de Dados (Schema Prisma)

### Entidades Principais

| Modelo | Coleção MongoDB | Descrição |
|--------|----------------|-----------|
| `Student` | `students` | Dados do aluno + plano + status |
| `Suggestion` | `suggestions` | Sugestões de treino geradas pela IA |
| `Workout` | `workouts` | Treinos aprovados pelo treinador |
| `WorkoutPublication` | `workout_publications` | Publicações versionadas com mídia |
| `Exercise` | `exercises` | Catálogo de exercícios |
| `ExerciseLog` | `exercise_logs` | Logs de execução (PREMIUM) |
| `SessionExecution` | `session_executions` | Conclusão de sessões inteiras |
| `ProgressEntry` | `progress_entries` | Registro de evolução corporal |
| `PersonalRecord` | — | Records pessoais de exercícios |
| `StudentAreaToken` | `student_area_tokens` | Tokens de acesso do aluno |
| `WorkoutLog` | `workout_logs` | Logs legados de execução |
| `Payment` | `payments` | Cobranças financeiras |
| `CheckIn` | `checkins` | Registros de presença |
| `Message` | `messages` | Mensagens aluno → treinador |
| `MuscleGroup` | `muscle_groups` | Referência: grupos musculares |
| `Equipment` | `equipments` | Referência: equipamentos |

### Enums

| Enum | Valores |
|------|---------|
| `StudentPlan` | BASE, PREMIUM |
| `StatusAluno` | Ativo, Inativo |
| `StatusSugestao` | Pendente, Aprovado, Rejeitado |
| `StatusTreino` | Vigente, Vencido, Historico |
| `LogStatus` | FEITO, NAO_FEITO, SUBSTITUIDO, PARCIAL |
| `SkipReason` | DOR, TEMPO, APARELHO_OCUPADO, FALTA_APARELHO, CANSACO, OUTRO |
| `PaymentStatus` | PENDING, PAID, OVERDUE, CANCELLED |
| `PaymentMethod` | CREDIT_CARD, DEBIT_CARD, CASH, PIX, TRANSFER |
| `NivelExercicio` | Iniciante, Intermediario, Avancado |
| `LocalExercicio` | Academia, Casa, Calistenia |
| `LocalTreino` | Academia, Calistenia, Casa |

---

## 7. API REST — Endpoints

### Visão Geral

| Prefixo | Módulo | Tipo |
|---------|--------|------|
| `/api/student` | Gestão de alunos | CRUD |
| `/api/ai` | Geração IA (Groq) | Action |
| `/api/trainer` | Revisão do treinador | CRUD + PDF |
| `/api/dashboard` | Dashboard do gestor | Read-only |
| `/api/exercises` | Catálogo de exercícios | CRUD + Upload |
| `/api/financial` | Gestão financeira | CRUD |
| `/api/checkin` | Check-in de presença | CRUD |
| `/api/reference` | Tabelas de referência | CRUD |
| `/api/student-area` | Área do aluno (pública) | Mixed |
| `/api/publications` | Publicações de treino | CRUD |
| `/api/logs` | Logs de execução | CRUD (Token) |
| `/api/progress` | Registros de evolução | CRUD (Token) |
| `/api/prs` | Records pessoais | CRUD (Token) |
| `/api/manager-ai` | IA gerencial (OpenAI) | Action |
| `/api/health` | Health check | Status |
| `/api/test-db` | Teste de conexão DB | Status |

---

## 8. Autenticação e Segurança

### Modelo de Autenticação

O sistema utiliza **autenticação por token único** para a Área do Aluno:

```
Token: 64 caracteres hexadecimais (crypto.randomBytes(32))
Expiração: 180 dias por padrão
Validação: Lookup direto no MongoDB (índice unique)
```

### Middleware de Autenticação

| Middleware | Função |
|-----------|--------|
| `studentTokenAuth` | Valida token Bearer no header Authorization |
| `requirePremium` | Verifica `student.has_premium_access === true` |

### Práticas de Segurança Implementadas

- ✅ Tokens nunca logados em texto puro
- ✅ Stack traces não expostos em respostas HTTP
- ✅ Validação de entrada em todos os endpoints
- ✅ CORS configurável por variável de ambiente
- ✅ Whitelist de campos no update de alunos
- ✅ Cascade delete para manter integridade referencial
- ✅ Mesma validação de grupo muscular ao substituir exercícios

---

## 9. Variáveis de Ambiente

### Backend (`server/.env`)

| Variável | Obrigatório | Descrição | Exemplo |
|----------|-------------|-----------|---------|
| `DATABASE_URL` | ✅ | String de conexão MongoDB | `mongodb://localhost:27017/novafitness` |
| `PORT` | ❌ | Porta do servidor (padrão: 5000) | `5000` |
| `CORS_ORIGINS` | ❌ | Origens permitidas (separadas por vírgula) | `http://localhost:5173` |
| `GROQ_API_KEY` | ❌ | Chave da API Groq para IA de treinos | `gsk_...` |
| `OPENAI_API_KEY` | ❌ | Chave da API OpenAI para IA gerencial | `sk-...` |
| `IA_PROVIDER` | ❌ | Provedor de IA para Manager AI (padrão: mock) | `openai` ou `mock` |
| `APP_BASE_URL` | ❌ | URL base da aplicação frontend | `http://localhost:5173` |

### Frontend (`client/.env`)

| Variável | Obrigatório | Descrição | Exemplo |
|----------|-------------|-----------|---------|
| `VITE_API_URL` | ❌ | URL base do backend (padrão: `/api`) | `http://localhost:5000/api` |

---

## 10. Como Executar

### Pré-requisitos

- **Node.js** 20+
- **MongoDB** 7+ (local ou Atlas)
- **npm** ou **yarn**

### Passo a Passo

```bash
# 1. Clonar o repositório
cd c:\Projetos\NovaFitness

# 2. Instalar dependências do backend
cd server
npm install

# 3. Configurar variáveis de ambiente
# Copie o .env.example para .env e configure DATABASE_URL, GROQ_API_KEY, etc.

# 4. Gerar o Prisma Client
npx prisma generate

# 5. Fazer push do schema para o MongoDB
npx prisma db push

# 6. (Opcional) Popular com dados de teste
node src/seed.js

# 7. Iniciar o backend (porta 5000)
node src/app.js

# 8. Em outro terminal, iniciar o frontend (porta 5173)
cd ../client
npm install
npm run dev
```

### URLs de Acesso

| URL | Descrição |
|-----|-----------|
| `http://localhost:5173` | Frontend (Dashboard do Gestor) |
| `http://localhost:5000/api/health` | Health check do backend |
| `http://localhost:5173/area-aluno/token/{TOKEN}` | Área do Aluno |
| `http://localhost:5173/cadastro-aluno` | Auto-cadastro público |

---

> **NovaFitness AI Trainer** — Transformando a gestão fitness com Inteligência Artificial 💪🤖
