const { MongoClient } = require('mongodb');

async function initiateReplicaSet() {
    const uri = "mongodb://127.0.0.1:27017/?directConnection=true";
    const client = new MongoClient(uri);

    try {
        console.log("🔌 Conectando ao MongoDB...");
        await client.connect();
        console.log("✅ Conectado!");

        console.log("🚀 Iniciando Replica Set...");
        try {
            const result = await client.db().admin().command({ replSetInitiate: {} });
            console.log("🎉 Replica Set iniciado com sucesso!", result);
        } catch (error) {
            if (error.codeName === 'AlreadyInitialized') {
                console.log("⚠️ Replica Set já estava iniciado.");
            } else {
                throw error;
            }
        }

    } catch (error) {
        console.error("❌ Erro ao iniciar Replica Set:", error);
    } finally {
        await client.close();
    }
}

initiateReplicaSet();
