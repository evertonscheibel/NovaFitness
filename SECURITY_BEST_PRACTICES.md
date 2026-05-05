# 🔒 Boas Práticas de Segurança - NovaFitness

Este documento descreve as melhores práticas de segurança para o sistema NovaFitness, com foco em gerenciamento de credenciais, proteção de dados e monitoramento.

---

## 🔐 Gerenciamento de Credenciais

### 1. Google Cloud Secret Manager

#### Vantagens
- ✅ Credenciais criptografadas em repouso e em trânsito
- ✅ Controle de acesso granular via IAM
- ✅ Auditoria completa de todos os acessos
- ✅ Versionamento automático de secrets
- ✅ Rotação facilitada de credenciais

#### Configuração Segura

**Nunca exponha credenciais:**
```javascript
// ❌ ERRADO - Nunca faça isso
const mongoURI = "mongodb+srv://user:password@cluster.mongodb.net/db";

// ✅ CORRETO - Use Secret Manager
import { getSecret } from './services/secret-manager.service.js';
const mongoURI = await getSecret('MONGODB_URI');
```

**Princípio do Menor Privilégio:**
- Service accounts devem ter apenas as permissões necessárias
- Use roles específicas: `Secret Manager Secret Accessor` (não `Owner` ou `Editor`)
- Crie service accounts separadas para diferentes ambientes (dev, staging, prod)

### 2. Variáveis de Ambiente

#### Arquivo .env

**Estrutura segura:**
```env
# ✅ Apenas referências, não valores sensíveis
GOOGLE_CLOUD_PROJECT_ID=meu-projeto
GOOGLE_APPLICATION_CREDENTIALS=./config/gcp-credentials.json
MONGODB_SECRET_NAME=MONGODB_URI

# ❌ Evite armazenar credenciais diretamente
# MONGODB_URI=mongodb+srv://user:password@...
```

#### .gitignore

**Sempre adicione:**
```gitignore
# Environment variables
.env
.env.local
.env.production

# Google Cloud credentials
config/gcp-credentials.json
*.json
!package.json
!package-lock.json

# Logs que podem conter informações sensíveis
*.log
logs/
```

### 3. Rotação de Credenciais

#### Frequência Recomendada
- **Produção**: A cada 90 dias
- **Desenvolvimento**: A cada 180 dias
- **Após incidente de segurança**: Imediatamente

#### Processo de Rotação

**MongoDB Atlas:**
1. Criar novo usuário com senha forte
2. Atualizar secret no Secret Manager com nova URI
3. Reiniciar aplicação (conexão será atualizada automaticamente)
4. Aguardar 24-48h para garantir estabilidade
5. Remover usuário antigo

**Service Account do Google Cloud:**
1. Criar nova chave JSON
2. Atualizar arquivo de credenciais no servidor
3. Reiniciar aplicação
4. Aguardar 24-48h
5. Revogar chave antiga

---

## 🌐 Segurança de Rede

### MongoDB Atlas - Network Access

#### Desenvolvimento
```
IP: Seu IP atual
Descrição: "Dev - [Seu Nome] - [Data]"
```

#### Produção
```
# Adicione apenas IPs específicos
IP: 203.0.113.10/32
Descrição: "Servidor Produção - AWS EC2"

IP: 198.51.100.20/32
Descrição: "Servidor Backup - Azure VM"
```

**⚠️ NUNCA use `0.0.0.0/0` em produção!**

### SSL/TLS

#### MongoDB Atlas
- ✅ SSL/TLS é obrigatório e habilitado por padrão
- ✅ Certificados gerenciados automaticamente
- ✅ Conexões sempre criptografadas

#### Aplicação Web
```javascript
// Para produção, force HTTPS
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

---

## 📊 Monitoramento e Auditoria

### 1. Logs de Aplicação

#### Configuração de Logging

```javascript
// Níveis de log apropriados
const LOG_LEVELS = {
  production: 'warn',
  development: 'debug',
  test: 'error'
};

// Nunca logue informações sensíveis
// ❌ ERRADO
console.log('MongoDB URI:', mongoURI);

// ✅ CORRETO
console.log('MongoDB conectado:', {
  host: conn.connection.host,
  database: conn.connection.name
});
```

#### Sanitização de Logs

```javascript
// Função para sanitizar dados sensíveis
const sanitizeForLog = (obj) => {
  const sanitized = { ...obj };
  const sensitiveKeys = ['password', 'token', 'apiKey', 'secret'];
  
  for (const key in sanitized) {
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
      sanitized[key] = '***REDACTED***';
    }
  }
  
  return sanitized;
};
```

### 2. Google Cloud Audit Logs

#### Configurar Alertas

1. Acesse **"Logging" → "Logs-based Metrics"**
2. Crie métrica para acessos ao Secret Manager:
   ```
   resource.type="secretmanager.googleapis.com/Secret"
   protoPayload.methodName="google.cloud.secretmanager.v1.SecretManagerService.AccessSecretVersion"
   ```
3. Configure alertas para:
   - Múltiplas falhas de acesso (possível ataque)
   - Acessos fora do horário comercial
   - Acessos de IPs não reconhecidos

### 3. MongoDB Atlas Monitoring

#### Métricas Importantes
- **Conexões simultâneas**: Detectar picos anormais
- **Operações por segundo**: Identificar uso excessivo
- **Latência**: Problemas de performance
- **Falhas de autenticação**: Tentativas de acesso não autorizado

#### Configurar Alertas

1. No MongoDB Atlas, vá para **"Alerts"**
2. Configure alertas para:
   - Conexões > 80% do limite
   - Uso de CPU > 75%
   - Uso de memória > 80%
   - Falhas de conexão
   - Operações lentas (> 100ms)

---

## 🛡️ Proteção de Dados

### 1. Criptografia

#### Em Repouso (MongoDB Atlas)
- ✅ Habilitado por padrão em todos os clusters
- ✅ Usa AES-256
- ✅ Chaves gerenciadas pelo MongoDB ou BYOK (Bring Your Own Key)

#### Em Trânsito
- ✅ TLS 1.2+ obrigatório
- ✅ Certificados válidos e atualizados
- ✅ Sem suporte a protocolos inseguros (SSLv3, TLS 1.0)

### 2. Backup e Disaster Recovery

#### MongoDB Atlas Backups

**Configuração:**
1. Acesse **"Backup"** no cluster
2. Habilite **"Continuous Backup"** (clusters M10+)
3. Configure retenção:
   - Snapshots diários: 7 dias
   - Snapshots semanais: 4 semanas
   - Snapshots mensais: 12 meses

**Teste de Restauração:**
- Realize testes trimestrais de restauração
- Documente o processo e tempo de recuperação (RTO)
- Valide integridade dos dados restaurados

### 3. Controle de Acesso

#### MongoDB - Roles e Permissões

```javascript
// Exemplo de usuários com diferentes privilégios

// Usuário de aplicação (read/write)
{
  user: "novafitness-app",
  roles: [
    { role: "readWrite", db: "novafitness" }
  ]
}

// Usuário de backup (read only)
{
  user: "novafitness-backup",
  roles: [
    { role: "read", db: "novafitness" }
  ]
}

// Administrador (uso restrito)
{
  user: "novafitness-admin",
  roles: [
    { role: "dbAdmin", db: "novafitness" },
    { role: "userAdmin", db: "novafitness" }
  ]
}
```

---

## 🚨 Resposta a Incidentes

### Plano de Ação para Vazamento de Credenciais

#### 1. Contenção Imediata (0-1h)
- [ ] Revogar credenciais comprometidas
- [ ] Bloquear IPs suspeitos no MongoDB Atlas
- [ ] Desabilitar service account comprometida
- [ ] Notificar equipe de segurança

#### 2. Investigação (1-4h)
- [ ] Revisar logs de acesso (Google Cloud + MongoDB)
- [ ] Identificar escopo do comprometimento
- [ ] Documentar timeline do incidente
- [ ] Preservar evidências

#### 3. Recuperação (4-24h)
- [ ] Criar novas credenciais
- [ ] Atualizar secrets no Secret Manager
- [ ] Atualizar service accounts
- [ ] Reiniciar aplicações
- [ ] Validar funcionamento

#### 4. Pós-Incidente (24h+)
- [ ] Análise de causa raiz
- [ ] Implementar melhorias de segurança
- [ ] Atualizar documentação
- [ ] Treinar equipe
- [ ] Relatório final

---

## ✅ Checklist de Segurança

### Configuração Inicial
- [ ] Secrets armazenados no Secret Manager (não em .env)
- [ ] Arquivo .gitignore configurado corretamente
- [ ] Service account com permissões mínimas
- [ ] SSL/TLS habilitado
- [ ] IPs específicos na whitelist (produção)

### Operação Contínua
- [ ] Rotação de credenciais agendada
- [ ] Alertas configurados (Google Cloud + MongoDB)
- [ ] Backups automáticos habilitados
- [ ] Logs sendo coletados e analisados
- [ ] Testes de restauração realizados

### Revisão Periódica (Mensal)
- [ ] Revisar acessos aos secrets
- [ ] Validar permissões de service accounts
- [ ] Verificar alertas disparados
- [ ] Analisar métricas de uso
- [ ] Atualizar documentação

### Auditoria (Trimestral)
- [ ] Teste de penetração
- [ ] Revisão de código (foco em segurança)
- [ ] Validação de compliance
- [ ] Treinamento de equipe
- [ ] Atualização de políticas

---

## 📚 Recursos e Referências

### Documentação Oficial
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Google Cloud Security Best Practices](https://cloud.google.com/security/best-practices)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/administration/security-checklist/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

### Ferramentas Recomendadas
- **Análise de Vulnerabilidades**: `npm audit`, Snyk, Dependabot
- **Análise de Código**: ESLint com plugins de segurança
- **Monitoramento**: Google Cloud Monitoring, Datadog, New Relic
- **Secrets Scanning**: GitGuardian, TruffleHog

### Compliance
- **LGPD** (Lei Geral de Proteção de Dados - Brasil)
- **GDPR** (General Data Protection Regulation - Europa)
- **PCI DSS** (se processar pagamentos)
- **ISO 27001** (Gestão de Segurança da Informação)

---

## 🆘 Contatos de Emergência

```
Equipe de Segurança: security@suaempresa.com
Suporte Google Cloud: https://cloud.google.com/support
Suporte MongoDB Atlas: https://support.mongodb.com
```

---

**Última atualização:** 2025-12-05  
**Próxima revisão:** 2026-03-05
