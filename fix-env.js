const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, 'server', '.env');
const content = `DATABASE_URL="mongodb://127.0.0.1:27017/novafitness"
PORT=5000
NODE_ENV=development
`;

try {
    fs.writeFileSync(envPath, content, 'utf8');
    console.log('✅ .env corrigido com sucesso!');
    console.log('Conteúdo escrito:');
    console.log(content);
} catch (error) {
    console.error('❌ Erro ao escrever .env:', error);
}
