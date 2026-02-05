import React, { useState } from 'react';
import { Minus, Plus, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ItemCard({ item, onClick }) {
    const { plannedItems, updatePlannedQuantity } = useApp();
    const quantity = plannedItems[item.id] || 0;

    // Determine Reference Price
    const p1 = item.lastPrice_m1 || Infinity;
    const p2 = item.lastPrice_m2 || Infinity;
    const lowest = Math.min(p1, p2);

    let priceLabel = '--';
    let sourceLabel = '';

    if (lowest !== Infinity) {
        priceLabel = `R$ ${lowest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        if (p1 === p2) sourceLabel = '(ref)';
        else if (p1 < p2) sourceLabel = "(Sam's)";
        else sourceLabel = "(Shibata)";
    }

    // Determine border color based on source? Or just clean white card?
    // User requested "Nome + Ref: R$ XX (Source) + stepper"

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            border: quantity > 0 ? '1px solid #3B82F6' : '1px solid transparent',
            transition: 'all 0.2s',
            position: 'relative'
        }}>
            {/* Main Content */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }} onClick={onClick}>
                {/* Image / Icon */}
                <div style={{
                    width: '48px', height: '48px',
                    background: '#f3f4f6', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                }}>
                    {item.imageUrl ?
                        <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                        : <Package size={20} color="#9CA3AF" />
                    }
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', lineHeight: '1.2', color: '#1F2937' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                        {lowest !== Infinity ? (
                            <span style={{ color: '#059669', fontWeight: '500' }}>
                                {priceLabel} <span style={{ color: '#9CA3AF', fontWeight: 'normal' }}>{sourceLabel}</span>
                            </span>
                        ) : '--'}
                    </div>
                </div>
            </div>

            {/* Stepper (Full Width Row) */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: '1px solid #F3F4F6'
            }}>
                <button
                    onClick={(e) => { e.stopPropagation(); updatePlannedQuantity(item.id, -1); }}
                    style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: quantity > 0 ? '#FEE2E2' : '#F3F4F6',
                        color: quantity > 0 ? '#DC2626' : '#9CA3AF',
                        border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '18px', cursor: 'pointer'
                    }}
                >
                    <Minus size={16} />
                </button>

                <span style={{ fontWeight: 'bold', fontSize: '16px', color: quantity > 0 ? '#111827' : '#9CA3AF', minWidth: '30px', textAlign: 'center' }}>
                    {quantity}
                </span>

                <button
                    onClick={(e) => { e.stopPropagation(); updatePlannedQuantity(item.id, 1); }}
                    style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: '#DBEAFE',
                        color: '#2563EB',
                        border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '18px', cursor: 'pointer'
                    }}
                >
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
}
