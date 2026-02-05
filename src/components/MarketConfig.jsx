import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Save } from 'lucide-react';

export default function MarketConfig() {
    const { markets, updateMarket, navigate } = useApp();

    // Local state for form
    const [localMarkets, setLocalMarkets] = useState(markets);

    const handleSave = () => {
        localMarkets.forEach(m => updateMarket(m));
        navigate('HOME');
    };

    const handleChange = (index, field, value) => {
        const newMarkets = [...localMarkets];
        newMarkets[index] = { ...newMarkets[index], [field]: value };
        setLocalMarkets(newMarkets);
    };

    return (
        <div style={{ padding: '20px', paddingTop: '80px' }}>
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0,
                background: 'var(--surface-color)', padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: '16px',
                boxShadow: 'var(--shadow-sm)', zIndex: 50
            }}>
                <button className="btn-icon" onClick={() => navigate('HOME')}>
                    <ArrowLeft size={24} />
                </button>
                <h2>Configurar Mercados</h2>
            </div>

            <div style={{ display: 'grid', gap: '24px' }}>
                {localMarkets.map((market, idx) => (
                    <div key={market.id} className="card">
                        <h3 style={{
                            marginBottom: '16px',
                            color: idx === 0 ? 'var(--market1-color)' : 'var(--market2-color)'
                        }}>
                            Mercado {idx + 1}
                        </h3>

                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Nome</label>
                            <input
                                className="input-field"
                                value={market.name}
                                onChange={(e) => handleChange(idx, 'name', e.target.value)}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Site (URL)</label>
                            <input
                                className="input-field"
                                value={market.url}
                                onChange={(e) => handleChange(idx, 'url', e.target.value)}
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                ))}
            </div>

            <button
                className="btn-primary"
                style={{ width: '100%', marginTop: '32px' }}
                onClick={handleSave}
            >
                <Save size={20} />
                Salvar Alterações
            </button>
        </div>
    );
}
