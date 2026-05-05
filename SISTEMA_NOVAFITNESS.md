# 📄 Documentação do Sistema NovaFitness AI Trainer

NovaFitness é um sistema inteligente de gestão de treinamento físico que utiliza Inteligência Artificial para gerar planos de treino personalizados de acordo com as necessidades e objetivos de cada aluno.

---

## 🏗️ Arquitetura Técnica

O sistema é construído sobre uma stack moderna orientada a performance e escalabilidade:

### Stack Tecnológica
- **Frontend**: [React 18](https://react.dev/) com [Vite](https://vitejs.dev/)
- **Backend**: [Node.js](https://nodejs.org/) com [Express](https://expressjs.com/)
- **Banco de Dados**: [MongoDB](https://www.mongodb.com/) gerenciado via [Prisma ORM](https://www.prisma.io/)
- **Inteligência Artificial**: [OpenAI API](https://openai.com/api/) (GPT-4o-mini)
- **Documentação de Treino**: [PDFKit](http://pdfkit.org/) para geração de fichas em PDF

---

## 🗄️ Modelagem de Dados (Prisma)

O esquema de dados centraliza as informações em coleções otimizadas para o fluxo de treinamento:

### Principais Modelos
- **`Student`**: Dados cadastrais, anamnese, restrições e status.
- **`Suggestion`**: Treinos sugeridos pela IA aguardando revisão.
- **`Workout`**: Treinos aprovados e vigentes.
- **`Exercise`**: Catálogo de exercícios com mídia (imagens/vídeos) e metadados.
- **`Payment` & `CheckIn`**: Controle financeiro e de frequência.

> [!NOTE]
> O banco de dados utiliza MongoDB com o Prisma Client para garantir tipagem forte e migrações consistentes.

---

## 🚀 Fluxos Principais

### 1. Cadastro e Geração de Treino
1. O aluno preenche o formulário de anamnese (público ou interno).
2. O sistema salva o aluno e envia os dados para o `ai.service.js`.
3. A IA processa o perfil e gera um JSON estruturado com exercícios, séries, repetições e observações.
4. Uma `Suggestion` é criada com status `Pendente`.

### 2. Revisão do Treinador
1. O treinador acessa o painel de revisão.
2. Analisa a sugestão da IA, podendo ajustar ou validar os exercícios.
3. Ao aprovar, a sugestão torna-se um `Workout` oficial.

### 3. Área do Aluno
1. O aluno acessa seu portal via link único.
2. Visualiza o treino vigente, registra execuções e faz check-in na academia.
3. Pode gerar o PDF do treino para uso offline.

---

## 🔌 Endpoints da API (Resumo)

### Estudantes (`/api/student`)
- `POST /register`: Cadastro inicial.
- `GET /`: Listagem geral.
- `GET /:id`: Perfil detalhado.

### Treinador (`/api/trainer`)
- `GET /suggestions`: Treinos pendentes de aprovação.
- `POST /approve/:id`: Validação da sugestão.
- `GET /pdf/:workoutId`: Geração da ficha técnica.

### Área do Aluno (`/api/student-area`)
- `GET /:id`: Dados do treino e perfil para o aluno.

---

## 🛠️ Configuração e Instalação

### Backend
1. Navegue até `/server`.
2. Execute `npm install`.
3. Configure o `.env` (DATABASE_URL, OPENAI_API_KEY).
4. Inicialize o Prisma: `npx prisma generate`.
5. Inicie: `npm run dev`.

### Frontend
1. Navegue até `/client`.
2. Execute `npm install`.
3. Inicie: `npm run dev`.

---

## 🔒 Segurança
- **CORS**: Configurado para aceitar apenas domínios autorizados.
- **Secrets**: Integração com Google Cloud Secret Manager suportada para produção.
- **SSL**: Conexão obrigatória com MongoDB Atlas.

---

*Documentação gerada automaticamente via Antigravity em 19/01/2026.*
