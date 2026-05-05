const fs = require('fs');
const path = require('path');

const normalizeString = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '-');
};

const exercises = [
    { nome: 'Supino Reto com Barra' },
    { nome: 'Supino Inclinado com Barra' },
    { nome: 'Supino Declinado' },
    { nome: 'Supino com Halteres' },
    { nome: 'Crucifixo com Halteres' },
    { nome: 'Crucifixo no Cabo' },
    { nome: 'Flexão de Braço' },
    { nome: 'Flexão Declinada' },
    { nome: 'Peck Deck (Voador)' },
    { nome: 'Supino na Máquina' },
    { nome: 'Barra Fixa (Pull-up)' },
    { nome: 'Puxada Frontal' },
    { nome: 'Remada Curvada com Barra' },
    { nome: 'Remada com Halteres' },
    { nome: 'Remada Cavalinho' },
    { nome: 'Remada Baixa' },
    { nome: 'Levantamento Terra' },
    { nome: 'Pulldown com Pegada Neutra' },
    { nome: 'Remada Invertida' },
    { nome: 'Pullover com Halter' },
    { nome: 'Agachamento Livre' },
    { nome: 'Leg Press 45°' },
    { nome: 'Agachamento Sumô' },
    { nome: 'Stiff (Levantamento Terra Romeno)' },
    { nome: 'Cadeira Extensora' },
    { nome: 'Mesa Flexora' },
    { nome: 'Afundo com Halteres' },
    { nome: 'Agachamento Búlgaro' },
    { nome: 'Panturrilha em Pé' },
    { nome: 'Panturrilha Sentado' },
    { nome: 'Desenvolvimento com Barra' },
    { nome: 'Desenvolvimento com Halteres' },
    { nome: 'Elevação Lateral' },
    { nome: 'Elevação Frontal' },
    { nome: 'Remada Alta' },
    { nome: 'Crucifixo Inverso' },
    { nome: 'Desenvolvimento Arnold' },
    { nome: 'Elevação Lateral no Cabo' },
    { nome: 'Rosca Direta com Barra' },
    { nome: 'Rosca Alternada com Halteres' },
    { nome: 'Rosca Martelo' },
    { nome: 'Rosca Scott' },
    { nome: 'Rosca Concentrada' },
    { nome: 'Rosca no Cabo' },
    { nome: 'Tríceps Testa (Lying Triceps)' },
    { nome: 'Tríceps Corda (Pushdown)' },
    { nome: 'Tríceps Francês' },
    { nome: 'Mergulho em Paralelas' },
    { nome: 'Tríceps Coice' },
    { nome: 'Tríceps Supinado' }
];

let content = 'GUIA DE RENOMEAÇÃO DE IMAGENS\n\n';
content += 'Para que o sistema reconheça as imagens, renomeie seus arquivos na pasta "imagens" para conter um dos seguintes nomes:\n\n';
content += 'EXERCÍCIO -> NOME DO ARQUIVO ESPERADO (pode ser .jpg, .png, .jpeg)\n';
content += '----------------------------------------------------------------\n';

exercises.forEach(ex => {
    content += `${ex.nome.padEnd(40)} -> ${normalizeString(ex.nome)}\n`;
});

fs.writeFileSync('c:/Projetos/NovaFitness/NOMES_PARA_RENOMEAR.txt', content);
console.log('Arquivo criado com sucesso!');
