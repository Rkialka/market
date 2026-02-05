import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { ShoppingCart } from 'lucide-react';

export default function CartDropZone({ market, count, onClick, color, isDragActive, stats }) {
    const { setNodeRef, isOver } = useDroppable({
        id: market.id,
        data: market
    });

    const isMarketOver = isOver; // If dragging specifically over THIS market

    // Dynamic Styles
    const borderColor = isMarketOver ? color : (isDragActive ? color : 'transparent');
    const borderStyle = (isDragActive || isMarketOver) ? 'dashed' : 'solid';
    const borderWidth = (isDragActive || isMarketOver) ? '2px' : '1px';
    const bg = isMarketOver ? '#F0F9FF' : '#FFFFFF';

    const style = {
        flex: 1,
        border: `${borderWidth} ${borderStyle} ${borderColor}`,
        backgroundColor: bg,
        transform: isMarketOver ? 'scale(1.02)' : 'scale(1)',
        transition: 'all 0.2s',
        padding: '12px',
        borderRadius: '12px',
        boxShadow: isDragActive ? 'none' : '0 1px 3px rgba(0,0,0,0.1)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        height: '110px', // slightly taller for stats
        justifyContent: 'center'
    };

    const formattedTotal = stats && stats.estimatedTotal > 0
        ? `R$ ${stats.estimatedTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : null;

    return (
        <div ref={setNodeRef} style={style}>
            {isDragActive ? (
                <div style={{ color: color, fontWeight: 'bold', textAlign: 'center' }}>
                    {isMarketOver ? "Soltar aqui!" : "Solte para adicionar"}
                </div>
            ) : (
                <>
                    <div style={{
                        fontWeight: 'bold',
                        color: color,
                        fontSize: '16px',
                        display: 'flex', alignItems: 'center', gap: '6px'
                    }}>
                        <ShoppingCart size={18} />
                        {market.name}
                    </div>

                    <div style={{
                        fontSize: '11px',
                        color: '#9CA3AF',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}>
                        {market.url ? new URL(market.url).hostname : 'No URL'}
                    </div>

                    <div style={{
                        marginTop: 'auto',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px'
                    }}>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#111827' }}>
                            {formattedTotal || <span style={{ fontSize: '10px', color: '#9CA3AF' }}>--</span>}
                        </div>
                        <div style={{ fontSize: '10px', color: '#6B7280', fontWeight: '500' }}>
                            {stats ? `${stats.uniqueItems} itens • ${stats.totalUnits} un` : `${count} itens`}
                        </div>

                        <button
                            onClick={onClick}
                            style={{
                                background: '#f3f4f6',
                                color: '#374151',
                                borderRadius: '20px',
                                padding: '4px 8px', // Slightly smaller
                                fontSize: '11px',
                                fontWeight: '600',
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: 'none',
                                marginTop: '4px'
                            }}
                        >
                            Ver Carrinho
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
