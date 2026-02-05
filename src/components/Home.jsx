import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, Plus, ShoppingCart, ArrowRight } from 'lucide-react';
import ItemCard from './ItemCard';
import ItemModal from './ItemModal';
import AddItemModal from './AddItemModal';

export default function Home() {
    const { items, categories, navigate, getPlannedStats } = useApp();
    const [selectedItem, setSelectedItem] = useState(null);
    const [isAddrOpen, setIsAddrOpen] = useState(false);

    // Get total from planned items
    const { count, total } = getPlannedStats();

    return (
        <div style={{ paddingBottom: '140px' }}> {/* Space for Footer */}

            {/* Header */}
            <div style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                backgroundColor: 'var(--bg-color)',
                boxShadow: '0 4px 6px -4px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 20px',
                    background: 'var(--surface-color)'
                }}>
                    <div>
                        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1F2937' }}>Montar Lista</h1>
                        <p style={{ fontSize: '13px', color: '#6B7280' }}>Passo 1: O que vamos comprar?</p>
                    </div>
                    <button className="btn-icon" onClick={() => navigate('MARKET_CONFIG')}>
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            {/* Aisles / Categories */}
            <div style={{ padding: '20px' }}>
                {categories.map(cat => {
                    const catItems = items.filter(i => i.category === cat);
                    if (catItems.length === 0) return null;

                    return (
                        <div key={cat} style={{ marginBottom: '24px' }}>
                            <h3 style={{
                                fontSize: '18px',
                                marginBottom: '12px',
                                color: 'var(--primary-color)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: '700'
                            }}>
                                {cat}
                                {/* Count badge if items selected in this category? Optional. */}
                            </h3>
                            <div className="grid-2">
                                {catItems.map(item => (
                                    <ItemCard
                                        key={item.id}
                                        item={item}
                                        onClick={() => setSelectedItem(item)}
                                    />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Floating Footer (Totals & Action) */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'white',
                padding: '16px 20px 24px 20px',
                borderTop: '1px solid #E5E7EB',
                boxShadow: '0 -4px 10px rgba(0,0,0,0.05)',
                zIndex: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px'
            }}>
                <div>
                    <div style={{ fontSize: '12px', color: '#6B7280', fontWeight: '500' }}>
                        {count > 0 ? `${count} itens selecionados` : 'Nenhum item'}
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>
                        R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                </div>

                <button
                    onClick={() => {
                        if (count > 0) {
                            alert("Indo para o Passo 2: Duelo de Preços! (Em breve)");
                            // navigate('STEP_2');
                        } else {
                            alert("Selecione pelo menos um item para continuar.");
                        }
                    }}
                    style={{
                        backgroundColor: count > 0 ? '#10B981' : '#E5E7EB',
                        color: count > 0 ? 'white' : '#9CA3AF',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        border: 'none',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: count > 0 ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s',
                        boxShadow: count > 0 ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
                    }}
                    disabled={count === 0}
                >
                    Confirmar
                    <ArrowRight size={20} />
                </button>
            </div>

        </div>
    );
}
