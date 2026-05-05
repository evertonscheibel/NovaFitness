
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function debug() {
    try {
        const targets = ['Stiff', 'Flexora Deitada', 'Leg 80', 'Agachamento Hack', 'Gluteo Maquina', 'Flexora Sentada', 'Flexao em pe'];

        for (const t of targets) {
            const exercises = await prisma.exercise.findMany({
                where: {
                    nome: { contains: t, mode: 'insensitive' }
                }
            });
            console.log(`--- Search for "${t}" ---`);
            if (exercises.length === 0) {
                console.log('NOT FOUND');
            }
            exercises.forEach(ex => {
                console.log(`${ex.nome} (id: ${ex.id}) | IMG: ${ex.image_url || 'MISSING'}`);
            });
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

debug();
