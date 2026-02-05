import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Trash2, GripVertical, CheckCircle, ExternalLink } from 'lucide-react';
import { DndContext, closestCenter, TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem({ item, onRemove }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.cartItemId });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        background: 'white',
        padding: '12px',
        borderRadius: '12px',
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        touchAction: 'none'
    };

    return (
        <div ref={setNodeRef} style={style}>
            <div {...attributes} {...listeners} style={{ color: '#9CA3AF', padding: '4px' }}>
                <GripVertical size={20} />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500' }}>{item.name}</div>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>{item.description}</div>
            </div>
            <button onClick={() => onRemove(item.cartItemId)} style={{ color: '#EF4444', padding: '8px' }}>
                <Trash2 size={20} />
            </button>
        </div>
    );
}

export default function CartView({ marketId }) {
    const { markets, carts, reorderCart, removeItemFromCart, navigate } = useApp();
    const [isSummary, setIsSummary] = useState(false);

    const market = markets.find(m => m.id === marketId);
    const items = carts[marketId] || [];

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 100,
                tolerance: 5,
            },
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = items.findIndex(i => i.cartItemId === active.id);
            const newIndex = items.findIndex(i => i.cartItemId === over.id);
            reorderCart(marketId, arrayMove(items, oldIndex, newIndex));
        }
    };

    if (isSummary) {
        return (
            <div style={{ padding: '20px', paddingTop: '80px', minHeight: '100vh', background: 'white' }}>
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0,
                    background: 'white', padding: '16px 20px',
                    display: 'flex', alignItems: 'center', gap: '16px',
                    borderBottom: '1px solid #E5E7EB', zIndex: 50
                }}>
                    <button className="btn-icon" onClick={() => setIsSummary(false)}>
                        <ArrowLeft size={24} />
                    </button>
                    <h2>Resumo da Compra</h2>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '32px', marginTop: '20px' }}>
                    <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
                    <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>Pronto para comprar!</h3>
                    <p style={{ color: '#6B7280' }}>
                        Você tem {items.length} itens na lista do <strong>{market.name}</strong>.
                    </p>
                </div>

                <div className="card" style={{ marginBottom: '32px' }}>
                    <ul style={{ paddingLeft: '20px', margin: 0 }}>
                        {items.map(i => (
                            <li key={i.cartItemId} style={{ marginBottom: '8px' }}>{i.name} <span style={{ color: '#9CA3AF', fontSize: '12px' }}>{i.description}</span></li>
                        ))}
                    </ul>
                </div>

                <a
                    href={market.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{
                        textDecoration: 'none',
                        backgroundColor: '#10B981',
                        marginBottom: '16px'
                    }}
                >
                    <ExternalLink size={20} />
                    Iniciar compra (Site)
                </a>

                <button
                    className="btn-primary"
                    style={{ width: '100%', backgroundColor: '#3B82F6' }}
                    onClick={() => alert("Modo Agente ativado! (Simulação)")}
                >
                    🤖 Iniciar compra (Modo Agente)
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', paddingTop: '80px', paddingBottom: '90px' }}>
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0,
                background: 'var(--surface-color)', padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: '16px',
                boxShadow: 'var(--shadow-sm)', zIndex: 50
            }}>
                <button className="btn-icon" onClick={() => navigate('HOME')}>
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <div style={{ fontSize: '12px', color: '#6B7280' }}>Carrinho</div>
                    <h2 style={{ fontSize: '20px' }}>{market.name}</h2>
                </div>
                <div style={{ marginLeft: 'auto', fontWeight: 'bold' }}>
                    {items.length}
                </div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={items.map(i => i.cartItemId)}
                    strategy={verticalListSortingStrategy}
                >
                    {items.map(item => (
                        <SortableItem
                            key={item.cartItemId}
                            item={item}
                            onRemove={removeItemFromCart.bind(null, marketId)}
                        />
                    ))}
                </SortableContext>
            </DndContext>

            {items.length === 0 && (
                <div style={{ textAlign: 'center', color: '#9CA3AF', marginTop: '50px' }}>
                    Carrinho vazio.<br />Arraste itens da tela inicial.
                </div>
            )}

            {items.length > 0 && (
                <div style={{
                    position: 'fixed', bottom: 0, left: 0, right: 0,
                    padding: '20px', background: 'white',
                    borderTop: '1px solid #E5E7EB',
                    display: 'flex', flexDirection: 'column', gap: '12px',
                    boxShadow: '0 -4px 6px -1px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '16px', fontWeight: 'bold' }}>
                        <span>Total Estimado:</span>
                        <span>R$ {items.reduce((acc, i) => acc + ((i.quantity || 1) * (i.lastPrice || 0)), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>

                    <button
                        className="btn-primary"
                        style={{ width: '100%', backgroundColor: '#10B981', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                        onClick={() => setIsSummary(true)}
                    >
                        <CheckCircle size={20} />
                        Concluir Lista
                    </button>
                </div>
            )}
        </div>
    );
}
