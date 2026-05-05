# 🚀 Migração Completa para PostgreSQL (Supabase)

## ✅ O que foi feito

### 1. Instalação e Configuração
- ✅ Removido Mongoose
- ✅ Instalado Prisma e @prisma/client
- ✅ Criado schema Prisma completo
- ✅ Configurado conexão com Supabase

### 2. Refatoração de Código
- ✅ `db.js` - Substituído Mongoose por Prisma Client
- ✅ `student.controller.js` - Refatorado para Prisma
- ✅ `ai.controller.js` - Refatorado para Prisma
- ✅ `trainer.controller.js` - Refatorado para Prisma
- ✅ `dashboard.controller.js` - Refatorado para Prisma
- ✅ `exercise.controller.js` - Refatorado para Prisma

### 3. Limpeza
- ✅ Removidos todos os models Mongoose
- ✅ Removido Google Cloud Secret Manager
- ✅ Atualizado package.json

---

## 🎯 Próximos Passos (VOCÊ PRECISA FAZER)

### Passo 1: Configurar DATABASE_URL

**Edite o arquivo `.env`:**

```bash
# Abra: c:\Projetos\NovaFitness\server\.env
```

**Configure assim:**

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA_AQUI@db.iknzxgqwtpvabklnroux.supabase.co:5432/postgres"
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=sua_chave_openai
```

**Substitua:**
- `SUA_SENHA_AQUI` → Senha do PostgreSQL do Supabase
- `sua_chave_openai` → Sua chave da API de IA

---

### Passo 2: Gerar Cliente Prisma

```bash
cd c:\Projetos\NovaFitness\server
npm run prisma:generate
```

Isso irá gerar o cliente Prisma baseado no schema.

---

### Passo 3: Criar Tabelas no PostgreSQL

```bash
npm run prisma:migrate
```

Quando solicitado, dê um nome para a migração (ex: `init`)

Isso irá:
1. Criar todas as tabelas no Supabase
2. Aplicar constraints e índices
3. Configurar relacionamentos

---

### Passo 4: Testar Conexão

```bash
npm run test:db
```

**Saída esperada:**
```
✅ PostgreSQL conectado com sucesso!
📊 Database: Supabase PostgreSQL
🔒 SSL/TLS: Ativado
✅ Tabelas acessíveis:
   - Students: 0 registros
   - Exercises: 0 registros
   - Workouts: 0 registros
   - Suggestions: 0 registros
🎉 Todos os testes passaram com sucesso!
```

---

### Passo 5: Iniciar Servidor

```bash
npm run dev
```

Você deve ver:
```
✅ PostgreSQL conectado com sucesso!
🚀 Servidor rodando na porta 5000
```

---

## 📊 Comandos Prisma Disponíveis

```bash
# Gerar cliente Prisma
npm run prisma:generate

# Executar migrações
npm run prisma:migrate

# Abrir Prisma Studio (interface visual)
npm run prisma:studio

# Push schema sem criar migração (dev)
npm run prisma:push

# Testar conexão
npm run test:db
```

---

## 🗄️ Estrutura do Banco de Dados

### Tabelas Criadas

1. **students** - Alunos cadastrados
   - id (serial, PK)
   - nome, telefone, email
   - idade, objetivo_principal
   - experiencia_prev, restricoes_medicas
   - status (Ativo/Inativo)
   - timestamps

2. **suggestions** - Sugestões de treino (IA)
   - id (serial, PK)
   - student_id (FK → students)
   - json_sugestao (JSONB)
   - status (Pendente/Aprovado/Rejeitado)
   - timestamps

3. **workouts** - Treinos aprovados
   - id (serial, PK)
   - student_id (FK → students)
   - prescricao (JSONB)
   - treinador, observacoes
   - validade_inicio, validade_fim
   - status (Vigente/Vencido/Historico)
   - timestamps

4. **exercises** - Catálogo de exercícios
   - id (serial, PK)
   - nome, grupo_muscular
   - equipamento, nivel[], local[]
   - descricao, video_url, image_url
   - ativo (boolean)
   - timestamps

---

## 🔄 Diferenças MongoDB → PostgreSQL

### IDs
- **MongoDB**: ObjectId (string)
- **PostgreSQL**: Serial/Integer

**Impacto:** Frontend pode precisar ajustar se espera strings

### Arrays
- **MongoDB**: Arrays nativos
- **PostgreSQL**: Arrays com enum types

**Exemplo:**
```javascript
// Antes (Mongoose)
nivel: ['Iniciante', 'Intermediário']

// Depois (Prisma)
nivel: [NivelExercicio.Iniciante, NivelExercicio.Intermediario]
```

### Queries
- **MongoDB**: `$regex`, `$gte`, `$lte`
- **PostgreSQL**: `contains`, `gte`, `lte`

---

## 🐛 Troubleshooting

### Erro: "Environment variable not found: DATABASE_URL"
→ Configure a variável DATABASE_URL no `.env`

### Erro: "Can't reach database server"
→ Verifique se a senha está correta e o Supabase está acessível

### Erro: "Table does not exist"
→ Execute `npm run prisma:migrate` para criar as tabelas

### Erro: "Prisma Client not generated"
→ Execute `npm run prisma:generate`

### Erro no Frontend: "Invalid ID format"
→ IDs agora são integers, não strings. Ajuste o frontend se necessário

---

## 📦 Popular Banco com Dados Iniciais

### Exercícios

Se você tinha um script de seed de exercícios, precisa adaptá-lo:

```javascript
// Antes (Mongoose)
await Exercise.create({ nome: "Supino", ... });

// Depois (Prisma)
await prisma.exercise.create({ data: { nome: "Supino", ... } });
```

Ou execute o seed existente após adaptar para Prisma.

---

## 🎨 Prisma Studio

Para visualizar e editar dados visualmente:

```bash
npm run prisma:studio
```

Abrirá uma interface web em `http://localhost:5555`

---

## ✅ Checklist Final

- [ ] DATABASE_URL configurada no .env
- [ ] Cliente Prisma gerado (`npm run prisma:generate`)
- [ ] Migrações executadas (`npm run prisma:migrate`)
- [ ] Teste de conexão passou (`npm run test:db`)
- [ ] Servidor iniciou com sucesso (`npm run dev`)
- [ ] Frontend testado e funcionando
- [ ] Dados iniciais populados (se necessário)

---

## 🎉 Pronto!

Seu sistema agora está rodando com:
- ✅ PostgreSQL (Supabase)
- ✅ Prisma ORM
- ✅ Type-safety completo
- ✅ Migrações automáticas
- ✅ Interface visual (Prisma Studio)

**Próximo passo:** Teste todas as funcionalidades do sistema!
