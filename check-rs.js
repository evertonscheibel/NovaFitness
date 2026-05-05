const { MongoClient } = require('mongodb');
async function check() {
    const uri = "mongodb://127.0.0.1:27017/?directConnection=true";
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const status = await client.db().admin().command({ replSetGetStatus: 1 });
        console.log("✅ Replica Set Status:", status.ok === 1 ? "OK" : "FAIL");
        if (status.members) {
            status.members.forEach(m => console.log(`Member: ${m.name} - ${m.stateStr}`));
        }
    } catch (e) {
        console.log("❌ Error checking RS:", e.message);
    } finally {
        await client.close();
    }
}
check();
