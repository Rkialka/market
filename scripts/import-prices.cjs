// scripts/import-prices.cjs
// Uso: node scripts/import-prices.cjs
// Lê os dados hardcoded abaixo e faz upsert em Firestore (collection: items)

const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(path.resolve(__dirname, "../.keys/firebase-admin.json"));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const COL = "items";

// helper simples pra criar IDs estáveis
function slugify(str) {
    return String(str)
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 80);
}

const TODAY = new Date().toISOString().slice(0, 10);

// ====== DADOS (último preço) ======
// market1 = Sam's | market2 = Shibata
// lastPrice_* é UNITÁRIO (o que você colou)

const sams = [
    { name: "Lava-Roupas Líquido Omo 5L", unit: "5L", category: "Limpeza & Casa", lastPrice_market1: 59.98 },
    { name: "Queijo Minas Member's Mark", unit: "~400g", category: "Laticínios & Ovos", lastPrice_market1: 23.99 },
    { name: "Leite UHT Desnatado Parmalat 1L", unit: "1L", category: "Laticínios & Ovos", lastPrice_market1: 3.78 },
    { name: "Vassoura Multiuso Noviça", unit: "1 un", category: "Limpeza & Casa", lastPrice_market1: 24.98 },
    { name: "Papel Manteiga Member's Mark", unit: "15m", category: "Limpeza & Casa", lastPrice_market1: 16.98 },
    { name: "Cerveja Heineken Pack 8x269ml", unit: "pack", category: "Bebidas / Prazer", lastPrice_market1: 31.12 },
    { name: "Mel Baldoni 1,1kg", unit: "1,1kg", category: "Mercearia Essencial", lastPrice_market1: 42.98 },
    { name: "Suco de Uva Integral Member's Mark 1,5L", unit: "1,5L", category: "Bebidas / Prazer", lastPrice_market1: 16.98 },
    { name: "Sabonete Líquido Mãos Palmolive Refil 900ml", unit: "900ml", category: "Higiene Pessoal", lastPrice_market1: 19.89 },
    { name: "Queijo Parmesão Member's Mark 200g", unit: "200g", category: "Laticínios & Ovos", lastPrice_market1: 17.98 },
    { name: "Chocolate ao Leite Member's Mark 300g", unit: "300g", category: "Bebidas / Prazer", lastPrice_market1: 39.98 },
    { name: "Água Sanitária Ypê 5L", unit: "5L", category: "Limpeza & Casa", lastPrice_market1: 12.48 },
    { name: "Desinfetante Ypê Lavanda 5L", unit: "5L", category: "Limpeza & Casa", lastPrice_market1: 19.48 },
    { name: "Ovos Bandeja 20 unidades", unit: "20 un", category: "Laticínios & Ovos", lastPrice_market1: 9.98 },
    { name: "Shampoo Inoar Blends 800ml", unit: "800ml", category: "Higiene Pessoal", lastPrice_market1: 24.98 },
];

const shibata = [
    { name: "Toalha Papel Kitch 2x120", unit: "pack", category: "Limpeza & Casa", lastPrice_market2: 9.90 },
    { name: "Filme PVC Transparente", unit: "1 un", category: "Limpeza & Casa", lastPrice_market2: 7.99 },
    { name: "Esponja Aço Bombril 6 un", unit: "6 un", category: "Limpeza & Casa", lastPrice_market2: 2.49 },
    { name: "Filtro Papel 3C 102 30 un", unit: "30 un", category: "Limpeza & Casa", lastPrice_market2: 4.19 },
    { name: "Filtro Papel 3C 103 30 un", unit: "30 un", category: "Limpeza & Casa", lastPrice_market2: 4.19 },
    { name: "Coca-Cola Zero 1,5L", unit: "1,5L", category: "Bebidas / Prazer", lastPrice_market2: 7.99 },
    { name: "Leite Piracanjuba Desnatado 1L", unit: "1L", category: "Laticínios & Ovos", lastPrice_market2: 3.69 },
    { name: "Filé Peito de Frango (peso variável)", unit: "kg", category: "Proteínas Frescas", lastPrice_market2: 27.90 }, // preço/kg
    { name: "Filé Peito Sadia Tira 400g", unit: "400g", category: "Proteínas Frescas", lastPrice_market2: 12.90 },
    { name: "Hambúrguer Friboi Misto 672g", unit: "672g", category: "Proteínas Frescas", lastPrice_market2: 18.90 },
    { name: "Frango Aurora Coxa Desf. 360g", unit: "360g", category: "Proteínas Frescas", lastPrice_market2: 22.90 },
    { name: "Contra Filé (peso variável)", unit: "kg", category: "Carnes Bovinas", lastPrice_market2: 62.90 }, // preço/kg
    { name: "Patinho Friboi Resfriado (peso variável)", unit: "kg", category: "Carnes Bovinas", lastPrice_market2: 53.90 }, // preço/kg
    { name: "Atum Coqueiro Ralado Natural 170g", unit: "170g", category: "Enlatados", lastPrice_market2: 8.99 },
    { name: "Patê Atum Coqueiro 170g", unit: "170g", category: "Enlatados", lastPrice_market2: 10.19 },
    { name: "Ovos Mantiqueira Extra 20 un", unit: "20 un", category: "Laticínios & Ovos", lastPrice_market2: 12.99 },
    { name: "Queijo Minas Frescal 300g", unit: "300g", category: "Laticínios & Ovos", lastPrice_market2: 6.49 },
    { name: "Banana Nanica (kg)", unit: "kg", category: "Hortifruti", lastPrice_market2: 6.99 }, // preço/kg
    { name: "Mamão Papaya (kg)", unit: "kg", category: "Hortifruti", lastPrice_market2: 8.99 }, // preço/kg
    { name: "Manga Palmer (kg)", unit: "kg", category: "Hortifruti", lastPrice_market2: 4.99 }, // preço/kg
    { name: "Maçã Fuji (kg)", unit: "kg", category: "Hortifruti", lastPrice_market2: 15.99 }, // preço/kg
    { name: "Uva Branca 500g", unit: "500g", category: "Hortifruti", lastPrice_market2: 9.99 },
    { name: "Tomate Italiano (kg)", unit: "kg", category: "Hortifruti", lastPrice_market2: 7.99 }, // preço/kg
    { name: "Brócolis 250g", unit: "250g", category: "Hortifruti", lastPrice_market2: 9.49 },
    { name: "Couve-Flor 350g", unit: "350g", category: "Hortifruti", lastPrice_market2: 9.49 },
    { name: "Alface Mimosa Hidropônica", unit: "1 un", category: "Hortifruti", lastPrice_market2: 4.69 },
    { name: "Limão Tahiti (kg)", unit: "kg", category: "Hortifruti", lastPrice_market2: 2.99 }, // preço/kg
    { name: "Pera Portuguesa (kg)", unit: "kg", category: "Hortifruti", lastPrice_market2: 15.99 }, // preço/kg
    { name: "Arroz 1kg", unit: "1kg", category: "Mercearia Essencial", lastPrice_market2: 3.69 },
    { name: "Macarrão Adria Penne Integral 500g", unit: "500g", category: "Mercearia Essencial", lastPrice_market2: 6.69 },
    { name: "Vinagre Vital Álcool 750ml", unit: "750ml", category: "Mercearia Essencial", lastPrice_market2: 1.75 },
    { name: "Azeite Gallo Classic 500ml", unit: "500ml", category: "Mercearia Essencial", lastPrice_market2: 30.60 },
    { name: "Sabonete Rexona Fresh 6x84g", unit: "pack", category: "Higiene Pessoal", lastPrice_market2: 15.90 },
    { name: "Enxaguante Bucal Plax 750ml", unit: "750ml", category: "Higiene Pessoal", lastPrice_market2: 19.90 },
];

async function upsertItems(items, marketLabelField, marketLabelValue) {
    let count = 0;

    for (const it of items) {
        const id = slugify(it.name);
        const ref = db.collection(COL).doc(id);

        const base = {
            name: it.name,
            unit: it.unit,
            category: it.category,
            [marketLabelField]: marketLabelValue,
            updatedAt: TODAY,
        };

        // merge evita apagar campos do outro mercado
        await ref.set({ ...base, ...it }, { merge: true });
        count++;
    }

    return count;
}

(async () => {
    try {
        const n1 = await upsertItems(sams, "market1_label", "Sam’s");
        const n2 = await upsertItems(shibata, "market2_label", "Shibata");
        console.log(`✅ Import concluído. Sam's: ${n1} | Shibata: ${n2}`);
        process.exit(0);
    } catch (err) {
        console.error("❌ Erro no import:", err);
        process.exit(1);
    }
})();
