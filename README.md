# 🏋️ NovaFitness — Ecossistema Inteligente para Academias

Plataforma completa de gestão fitness que conecta gestores, instrutores e alunos através de uma interface web robusta e aplicativo mobile integrado.

![Status](https://img.shields.io/badge/status-active-success.svg)
![React](https://img.shields.io/badge/react-18-blue.svg)
![React Native](https://img.shields.io/badge/react_native-mobile-blue.svg)
![TypeScript](https://img.shields.io/badge/typescript-5-blue.svg)
![MongoDB](https://img.shields.io/badge/mongodb-latest-brightgreen.svg)

## 🌟 Funcionalidades Principais

- **🤖 Personal Trainer IA**: Inteligência artificial para auxílio na montagem de treinos e análise de progresso.
- **📱 App do Aluno (Mobile)**: Acesso a fichas de treino, histórico de check-ins e acompanhamento de evolução.
- **👨‍🏫 Painel do Instrutor**: Gestão simplificada de alunos, criação de fichas e avaliação física.
- **💰 Gestão Financeira**: Controle de mensalidades, planos e pagamentos.
- **📍 Check-in e Presença**: Sistema de controle de fluxo de alunos na unidade.
- **📊 Dashboard Analítico**: KPIs de retenção, faturamento e ocupação.

## 🛠️ Stack Tecnológica

### Monorepo Structure
- **`/server`**: API robusta em **Node.js** com **TypeScript** e **MongoDB**.
- **`/client`**: Painel Administrativo/Web desenvolvido em **React**.
- **`/mobile`**: Aplicativo móvel multiplataforma em **React Native**.
- **`/shared`**: Código compartilhado (tipagens e lógica) entre os projetos.

## 🚀 Como Iniciar

### Pré-requisitos
- Node.js 18+
- Docker (opcional, para MongoDB)

### Instalação

1. **Configurar o Servidor**:
   ```bash
   cd server
   npm install
   npm run seed    # Popula o banco com exercícios padrão
   npm run dev
   ```

2. **Configurar o Painel Web**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

3. **Configurar o App Mobile**:
   ```bash
   cd mobile
   npm install
   npx react-native run-android # ou run-ios
   ```

## 🔐 Diferenciais
- **Arquitetura Escalável**: Separação clara entre mobile e web com lógica compartilhada.
- **IA First**: Foco em personalização de treinos usando modelos de linguagem.
- **Offline Ready**: Funcionalidades críticas preparadas para o ambiente mobile.

---
Desenvolvido por **Everton Scheibel**
