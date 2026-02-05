import { v4 as uuidv4 } from 'uuid';

export const CATEGORIES = [
    'Limpeza & Casa',
    'Laticínios & Ovos',
    'Higiene Pessoal',
    'Bebidas / Prazer',
    'Proteínas Frescas',
    'Hortifruti',
    'Mercearia Essencial'
];

export const INITIAL_MARKETS = [
    { id: 'm1', name: "Sam’s Club", url: "https://www.samsclub.com.br" },
    { id: 'm2', name: "Shibata", url: "https://www.shibata.com.br" }
];

export const INITIAL_ITEMS = [
    // Limpeza & Casa
    { id: uuidv4(), name: 'Lava-roupas líquido Omo', description: '5L', category: 'Limpeza & Casa', lastPrice: 48.90, lastPriceDate: '2026-01-10', lastPriceStore: "Sam’s", unit: '5L' },
    { id: uuidv4(), name: 'Água sanitária Ypê', description: '5L', category: 'Limpeza & Casa', lastPrice: 15.90, lastPriceDate: '2026-01-15', lastPriceStore: "Shibata", unit: '5L' },
    { id: uuidv4(), name: 'Desinfetante Ypê', description: '5L', category: 'Limpeza & Casa', lastPrice: 12.50, lastPriceDate: '2026-01-10', lastPriceStore: "Sam’s", unit: '5L' },
    { id: uuidv4(), name: 'Papel toalha', description: 'pacote grande', category: 'Limpeza & Casa', lastPrice: 32.90, lastPriceDate: '2026-01-20', lastPriceStore: "Sam’s", unit: 'pacote' },
    { id: uuidv4(), name: 'Papel manteiga Member’s Mark', description: '', category: 'Limpeza & Casa', lastPrice: 22.00, lastPriceDate: '2025-12-10', lastPriceStore: "Sam’s", unit: 'rolo' },
    { id: uuidv4(), name: 'Filtro de café', description: 'pacote grande', category: 'Limpeza & Casa', lastPrice: 9.50, lastPriceDate: '2026-01-05', lastPriceStore: "Shibata", unit: 'cx' },

    // Laticínios & Ovos
    { id: uuidv4(), name: 'Leite UHT desnatado', description: '8–12 caixas', category: 'Laticínios & Ovos', lastPrice: 4.59, lastPriceDate: '2026-02-01', lastPriceStore: "Shibata", unit: 'L' },
    { id: uuidv4(), name: 'Ovos', description: '20 unidades – 2 bandejas', category: 'Laticínios & Ovos', lastPrice: 28.90, lastPriceDate: '2026-02-01', lastPriceStore: "Sam’s", unit: 'bdj 20' },
    { id: uuidv4(), name: 'Queijo Minas Member’s Mark', description: '~400g', category: 'Laticínios & Ovos', lastPrice: 35.00, lastPriceDate: '2026-01-25', lastPriceStore: "Sam’s", unit: 'kg' },
    { id: uuidv4(), name: 'Queijo Parmesão Member’s Mark', description: '200–300g', category: 'Laticínios & Ovos', lastPrice: 45.00, lastPriceDate: '2026-01-12', lastPriceStore: "Sam’s", unit: 'pc' },

    // Higiene Pessoal
    { id: uuidv4(), name: 'Sabonete líquido mãos', description: 'refil', category: 'Higiene Pessoal', lastPrice: 18.90, lastPriceDate: '2026-01-22', lastPriceStore: "Sam’s", unit: 'refil' },
    { id: uuidv4(), name: 'Shampoo', description: '800ml ou maior', category: 'Higiene Pessoal', lastPrice: 32.50, lastPriceDate: '2026-01-10', lastPriceStore: "Sam’s", unit: 'frasco' },
    { id: uuidv4(), name: 'Sabonetes', description: 'pack', category: 'Higiene Pessoal', lastPrice: 12.90, lastPriceDate: '2026-01-15', lastPriceStore: "Shibata", unit: 'pack' },

    // Bebidas / Prazer
    { id: uuidv4(), name: 'Cerveja Heineken', description: 'packs', category: 'Bebidas / Prazer', lastPrice: 42.90, lastPriceDate: '2026-02-02', lastPriceStore: "Shibata", unit: 'pack' },
    { id: uuidv4(), name: 'Suco de uva integral', description: '', category: 'Bebidas / Prazer', lastPrice: 14.50, lastPriceDate: '2026-01-20', lastPriceStore: "Sam’s", unit: '1.5L' },
    { id: uuidv4(), name: 'Chocolate', description: 'opcional', category: 'Bebidas / Prazer', lastPrice: 19.90, lastPriceDate: '2026-01-20', lastPriceStore: "Sam’s", unit: 'barra' },

    // Proteínas Frescas
    { id: uuidv4(), name: 'Filé de peito de frango', description: '', category: 'Proteínas Frescas', lastPrice: 22.90, lastPriceDate: '2026-02-01', lastPriceStore: "Shibata", unit: 'kg' },
    { id: uuidv4(), name: 'Coxa/sobrecoxa desossada', description: '', category: 'Proteínas Frescas', lastPrice: 18.90, lastPriceDate: '2026-01-30', lastPriceStore: "Sam’s", unit: 'kg' },
    { id: uuidv4(), name: 'Patinho', description: 'moído ou peça', category: 'Proteínas Frescas', lastPrice: 38.90, lastPriceDate: '2026-02-01', lastPriceStore: "Shibata", unit: 'kg' },
    { id: uuidv4(), name: 'Contra-filé', description: '', category: 'Proteínas Frescas', lastPrice: 52.90, lastPriceDate: '2026-02-03', lastPriceStore: "Shibata", unit: 'kg' },
    { id: uuidv4(), name: 'Hambúrguer bovino', description: '', category: 'Proteínas Frescas', lastPrice: 25.90, lastPriceDate: '2026-01-15', lastPriceStore: "Sam’s", unit: 'cx' },
    { id: uuidv4(), name: 'Atum Coqueiro', description: '6–8 latas', category: 'Proteínas Frescas', lastPrice: 8.90, lastPriceDate: '2026-01-12', lastPriceStore: "Sam’s", unit: 'lata' },

    // Hortifruti
    { id: uuidv4(), name: 'Banana', description: '', category: 'Hortifruti', lastPrice: 5.90, lastPriceDate: '2026-02-03', lastPriceStore: "Shibata", unit: 'kg' },
    { id: uuidv4(), name: 'Mamão', description: '', category: 'Hortifruti', lastPrice: 8.50, lastPriceDate: '2026-02-01', lastPriceStore: "Shibata", unit: 'un' },
    { id: uuidv4(), name: 'Maçã', description: '', category: 'Hortifruti', lastPrice: 9.90, lastPriceDate: '2026-02-01', lastPriceStore: "Sam’s", unit: 'kg' },
    { id: uuidv4(), name: 'Pera', description: '', category: 'Hortifruti', lastPrice: 12.90, lastPriceDate: '2026-01-25', lastPriceStore: "Shibata", unit: 'kg' },
    { id: uuidv4(), name: 'Manga', description: '', category: 'Hortifruti', lastPrice: 6.50, lastPriceDate: '2026-01-20', lastPriceStore: "Shibata", unit: 'kg' },
    { id: uuidv4(), name: 'Uva', description: '', category: 'Hortifruti', lastPrice: 14.90, lastPriceDate: '2026-01-30', lastPriceStore: "Shibata", unit: 'bdj' },
    { id: uuidv4(), name: 'Tomate', description: '', category: 'Hortifruti', lastPrice: 7.90, lastPriceDate: '2026-02-02', lastPriceStore: "Shibata", unit: 'kg' },
    { id: uuidv4(), name: 'Alface', description: '', category: 'Hortifruti', lastPrice: 4.50, lastPriceDate: '2026-02-02', lastPriceStore: "Shibata", unit: 'un' },
    { id: uuidv4(), name: 'Brócolis', description: '', category: 'Hortifruti', lastPrice: 6.90, lastPriceDate: '2026-02-01', lastPriceStore: "Shibata", unit: 'un' },
    { id: uuidv4(), name: 'Couve-flor', description: '', category: 'Hortifruti', lastPrice: 7.50, lastPriceDate: '2026-02-01', lastPriceStore: "Shibata", unit: 'un' },
    { id: uuidv4(), name: 'Limão', description: '', category: 'Hortifruti', lastPrice: 3.90, lastPriceDate: '2026-01-15', lastPriceStore: "Shibata", unit: 'kg' },

    // Mercearia Essencial
    { id: uuidv4(), name: 'Arroz', description: '', category: 'Mercearia Essencial', lastPrice: 28.90, lastPriceDate: '2026-01-05', lastPriceStore: "Sam’s", unit: '5kg' },
    { id: uuidv4(), name: 'Macarrão', description: '', category: 'Mercearia Essencial', lastPrice: 4.50, lastPriceDate: '2026-01-15', lastPriceStore: "Shibata", unit: 'pct' },
    { id: uuidv4(), name: 'Vinagre', description: '', category: 'Mercearia Essencial', lastPrice: 5.90, lastPriceDate: '2026-01-10', lastPriceStore: "Shibata", unit: 'un' },
    { id: uuidv4(), name: 'Azeite Gallo', description: 'embalagem menor', category: 'Mercearia Essencial', lastPrice: 38.90, lastPriceDate: '2026-01-05', lastPriceStore: "Sam’s", unit: 'un' },
];
