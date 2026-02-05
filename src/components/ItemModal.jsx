import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, Edit2, ShoppingCart } from 'lucide-react';

export default function ItemModal({ item, onClose }) {
    const { markets, addItemToCart, deleteItem } = useApp();

    // Close on Escape
    useEffect(() => {
        const handleEsc = (e) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSendToCart = (marketId) => {
        addItemToCart(marketId, item);
        onClose();
    };

    const handleDelete = () => {
        if (window.confirm('Tem certeza que deseja remover este item?')) {
            deleteItem(item.id);
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '20px' }}>
                    <div>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {item.category}
                        </span>
                        <h2 style={{ fontSize: '24px', marginTop: '4px' }}>{item.name}</h2>
                        {item.description && (
                            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{item.description}</p>
                        )}
                    </div>
                    <button className="btn-icon" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {item.imageUrl && (
                    <div style={{ marginBottom: '24px', borderRadius: '12px', overflow: 'hidden', maxHeight: '200px' }}>
                        <img src={item.imageUrl} alt={item.name} style={{ width: '100%', objectFit: 'cover' }} />
                    </div>
                )}

                <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
                    <button
                        className="btn-primary"
                        style={{ backgroundColor: 'var(--market1-color)', width: '100%' }}
                        onClick={() => handleSendToCart(markets[0].id)}
                    >
                        <ShoppingCart size={20} />
                        Enviar para {markets[0].name}
                    </button>

                    <button
                        className="btn-primary"
                        style={{ backgroundColor: 'var(--market2-color)', width: '100%' }}
                        onClick={() => handleSendToCart(markets[1].id)}
                    >
                        <ShoppingCart size={20} />
                        Enviar para {markets[1].name}
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
                    <button
                        style={{
                            flex: 1, padding: '12px', borderRadius: '8px',
                            border: '1px solid #E5E7EB', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', gap: '8px',
                            fontWeight: '500'
                        }}
                        onClick={() => alert('Edição em breve')}
                    >
                        <Edit2 size={18} /> Editar
                    </button>
                    <button
                        style={{
                            flex: 1, padding: '12px', borderRadius: '8px',
                            border: '1px solid #FECACA', color: '#EF4444',
                            backgroundColor: '#FEF2F2', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', gap: '8px',
                            fontWeight: '500'
                        }}
                        onClick={handleDelete}
                    >
                        <Trash2 size={18} /> Remover
                    </button>
                </div>
            </div>
        </div>
    );
}
