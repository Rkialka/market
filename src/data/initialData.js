import { v4 as uuidv4 } from 'uuid';

// Helper to create stable IDs (matching Firestore script logic is good practice)
const slugify = (str) => String(str).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 80);

export const CATEGORIES = [
    "Proteínas Frescas",
    "Carnes Bovinas",
    "Hortifruti",
    "Laticínios & Ovos",
    "Mercearia Essencial",
    "Bebidas / Prazer",
    "Limpeza & Casa",
    "Higiene Pessoal",
    "Enlatados",
    "Outros"
];

export const INITIAL_MARKETS = [
    { id: 'm1', name: "Sam's Club", color: '#3B82F6', url: 'https://www.samsclub.com.br' },
    { id: 'm2', name: "Shibata", color: '#EF4444', url: 'https://shibata.com.br' }
];

// Raw Data from Import Script
const samsItems = [
    { name: "Lava-Roupas Líquido Omo 5L", unit: "5L", category: "Limpeza & Casa", lastPrice_m1: 59.98 },
    { name: "Queijo Minas Member's Mark", unit: "~400g", category: "Laticínios & Ovos", lastPrice_m1: 23.99 },
    { name: "Leite UHT Desnatado Parmalat 1L", unit: "1L", category: "Laticínios & Ovos", lastPrice_m1: 3.78 },
    { name: "Vassoura Multiuso Noviça", unit: "1 un", category: "Limpeza & Casa", lastPrice_m1: 24.98 },
    { name: "Papel Manteiga Member's Mark", unit: "15m", category: "Limpeza & Casa", lastPrice_m1: 16.98 },
    { name: "Cerveja Heineken Pack 8x269ml", unit: "pack", category: "Bebidas / Prazer", lastPrice_m1: 31.12 },
    { name: "Mel Baldoni 1,1kg", unit: "1,1kg", category: "Mercearia Essencial", lastPrice_m1: 42.98 },
    { name: "Suco de Uva Integral Member's Mark 1,5L", unit: "1,5L", category: "Bebidas / Prazer", lastPrice_m1: 16.98 },
    { name: "Sabonete Líquido Mãos Palmolive Refil 900ml", unit: "900ml", category: "Higiene Pessoal", lastPrice_m1: 19.89 },
    { name: "Queijo Parmesão Member's Mark 200g", unit: "200g", category: "Laticínios & Ovos", lastPrice_m1: 17.98 },
    { name: "Chocolate ao Leite Member's Mark 300g", unit: "300g", category: "Bebidas / Prazer", lastPrice_m1: 39.98 },
    { name: "Água Sanitária Ypê 5L", unit: "5L", category: "Limpeza & Casa", lastPrice_m1: 12.48 },
    { name: "Desinfetante Ypê Lavanda 5L", unit: "5L", category: "Limpeza & Casa", lastPrice_m1: 19.48 },
    { name: "Ovos Bandeja 20 unidades", unit: "20 un", category: "Laticínios & Ovos", lastPrice_m1: 9.98 },
    { name: "Shampoo Inoar Blends 800ml", unit: "800ml", category: "Higiene Pessoal", lastPrice_m1: 24.98 },
];

const shibataItems = [
    { name: "Toalha Papel Kitch 2x120", unit: "pack", category: "Limpeza & Casa", lastPrice_m2: 9.90 },
    { name: "Filme PVC Transparente", unit: "1 un", category: "Limpeza & Casa", lastPrice_m2: 7.99 },
    { name: "Esponja Aço Bombril 6 un", unit: "6 un", category: "Limpeza & Casa", lastPrice_m2: 2.49 },
    { name: "Filtro Papel 3C 102 30 un", unit: "30 un", category: "Limpeza & Casa", lastPrice_m2: 4.19 },
    { name: "Filtro Papel 3C 103 30 un", unit: "30 un", category: "Limpeza & Casa", lastPrice_m2: 4.19 },
    { name: "Coca-Cola Zero 1,5L", unit: "1,5L", category: "Bebidas / Prazer", lastPrice_m2: 7.99 },
    { name: "Leite Piracanjuba Desnatado 1L", unit: "1L", category: "Laticínios & Ovos", lastPrice_m2: 3.69 },
    { name: "Filé Peito de Frango (peso variável)", unit: "kg", category: "Proteínas Frescas", lastPrice_m2: 27.90 },
    { name: "Filé Peito Sadia Tira 400g", unit: "400g", category: "Proteínas Frescas", lastPrice_m2: 12.90 },
    { name: "Hambúrguer Friboi Misto 672g", unit: "672g", category: "Proteínas Frescas", lastPrice_m2: 18.90 },
    { name: "Frango Aurora Coxa Desf. 360g", unit: "360g", category: "Proteínas Frescas", lastPrice_m2: 22.90 },
    { name: "Contra Filé (peso variável)", unit: "kg", category: "Carnes Bovinas", lastPrice_m2: 62.90 },
    { name: "Patinho Friboi Resfriado (peso variável)", unit: "kg", category: "Carnes Bovinas", lastPrice_m2: 53.90 },
    { name: "Atum Coqueiro Ralado Natural 170g", unit: "170g", category: "Enlatados", lastPrice_m2: 8.99 },
    { name: "Patê Atum Coqueiro 170g", unit: "170g", category: "Enlatados", lastPrice_m2: 10.19 },
    { name: "Ovos Mantiqueira Extra 20 un", unit: "20 un", category: "Laticínios & Ovos", lastPrice_m2: 12.99 },
    { name: "Queijo Minas Frescal 300g", unit: "300g", category: "Laticínios & Ovos", lastPrice_m2: 6.49 },
    { name: "Banana Nanica (kg)", unit: "kg", category: "Hortifruti", lastPrice_m2: 6.99 },
    { name: "Mamão Papaya (kg)", unit: "kg", category: "Hortifruti", lastPrice_m2: 8.99 },
    { name: "Manga Palmer (kg)", unit: "kg", category: "Hortifruti", lastPrice_m2: 4.99 },
    { name: "Maçã Fuji (kg)", unit: "kg", category: "Hortifruti", lastPrice_m2: 15.99 },
    { name: "Uva Branca 500g", unit: "500g", category: "Hortifruti", lastPrice_m2: 9.99 },
    { name: "Tomate Italiano (kg)", unit: "kg", category: "Hortifruti", lastPrice_m2: 7.99 },
    { name: "Brócolis 250g", unit: "250g", category: "Hortifruti", lastPrice_m2: 9.49 },
    { name: "Couve-Flor 350g", unit: "350g", category: "Hortifruti", lastPrice_m2: 9.49 },
    { name: "Alface Mimosa Hidropônica", unit: "1 un", category: "Hortifruti", lastPrice_m2: 4.69 },
    { name: "Limão Tahiti (kg)", unit: "kg", category: "Hortifruti", lastPrice_m2: 2.99 },
    { name: "Pera Portuguesa (kg)", unit: "kg", category: "Hortifruti", lastPrice_m2: 15.99 },
    { name: "Arroz 1kg", unit: "1kg", category: "Mercearia Essencial", lastPrice_m2: 3.69 },
    { name: "Macarrão Adria Penne Integral 500g", unit: "500g", category: "Mercearia Essencial", lastPrice_m2: 6.69 },
    { name: "Vinagre Vital Álcool 750ml", unit: "750ml", category: "Mercearia Essencial", lastPrice_m2: 1.75 },
    { name: "Azeite Gallo Classic 500ml", unit: "500ml", category: "Mercearia Essencial", lastPrice_m2: 30.60 },
    { name: "Sabonete Rexona Fresh 6x84g", unit: "pack", category: "Higiene Pessoal", lastPrice_m2: 15.90 },
    { name: "Enxaguante Bucal Plax 750ml", unit: "750ml", category: "Higiene Pessoal", lastPrice_m2: 19.90 },
];

// Merge Logic
const mergedItems = {};

[...samsItems, ...shibataItems].forEach(item => {
    const id = slugify(item.name);
    if (!mergedItems[id]) {
        mergedItems[id] = { ...item, id: id };
    } else {
        // Merge fields
        mergedItems[id] = { ...mergedItems[id], ...item };
    }
});

export const INITIAL_ITEMS = Object.values(mergedItems).sort((a, b) => a.category.localeCompare(b.category));
