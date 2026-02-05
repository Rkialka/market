import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DndContext, TouchSensor, MouseSensor, useSensor, useSensors, DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core';
import { Settings, Plus, X } from 'lucide-react';
import CartDropZone from './CartDropZone';
import ItemCard from './ItemCard';
import { createPortal } from 'react-dom';
import ItemModal from './ItemModal'; // To be created
import AddItemModal from './AddItemModal'; // To be created

export default function Home() {
    const { items, categories, markets, carts, addItemToCart, navigate, getCartStats } = useApp();
    const [activeId, setActiveId] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null); // For detail modal
    const [isAddrOpen, setIsAddrOpen] = useState(false); // For add item modal

    // Sensors for "Press and Hold" to drag on touch devices
    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 5,
            },
        })
    );

    // Toast State
    const [toast, setToast] = useState({ show: false, message: '', color: '' });

    // Listen to custom event from ItemCard
    React.useEffect(() => {
        const handleItemAdded = (e) => {
            const mName = e.detail.marketName;
            showToast(`Adicionado ao ${mName}`, '#10B981');
        };
        window.addEventListener('item-added', handleItemAdded);
        return () => window.removeEventListener('item-added', handleItemAdded);
    }, []);

    const showToast = (message, color) => {
        setToast({ show: true, message, color });
        if (navigator.vibrate) navigator.vibrate(50);
        setTimeout(() => setToast({ show: false, message: '', color: '' }), 3000);
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (over && (over.id === markets[0].id || over.id === markets[1].id)) {
            // Dropped on a market
            addItemToCart(over.id, active.data.current);
            const marketName = markets.find(m => m.id === over.id).name;
            showToast(`Adicionado ao ${marketName}`, over.id === markets[0].id ? 'var(--market1-color)' : 'var(--market2-color)');
        }
    };

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: { opacity: '0.5' },
            },
        }),
    };

    const activeItemData = activeId ? items.find(i => i.id === activeId) : null;

    // Safety check
    if (!markets || markets.length < 2) {
        return <div style={{ padding: 20 }}>Carregando mercados... (Reset a configuração se persistir)</div>;
    }

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div style={{ paddingBottom: '90px' }}> {/* Space for FAB */}
                {/* Sticky Header & Carts */}
                <div style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                    backgroundColor: 'var(--bg-color)',
                    paddingBottom: '12px',
                    boxShadow: '0 4px 6px -4px rgba(0,0,0,0.1)'
                }}>
                    {/* Top Bar - Simplified */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 20px 8px 20px',
                        background: 'var(--surface-color)'
                    }}>
                        <h1 style={{ fontSize: '18px' }}>Minha Lista</h1>
                        <button className="btn-icon" onClick={() => navigate('MARKET_CONFIG')}>
                            <Settings size={20} />
                        </button>
                    </div>

                    {/* Carts Container */}
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        padding: '8px 20px 0 20px'
                    }}>
                        <CartDropZone
                            market={markets[0]}
                            count={carts[markets[0].id]?.length || 0}
                            stats={getCartStats(markets[0].id)}
                            color="var(--market1-color)"
                            onClick={() => navigate('CART_VIEW', { marketId: markets[0].id })}
                            isDragActive={!!activeId}
                        />
                        <CartDropZone
                            market={markets[1]}
                            count={carts[markets[1].id]?.length || 0}
                            stats={getCartStats(markets[1].id)}
                            color="var(--market2-color)"
                            onClick={() => navigate('CART_VIEW', { marketId: markets[1].id })}
                            isDragActive={!!activeId}
                        />
                    </div>
                </div>

                {/* Aisles */}
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
                                    gap: '8px'
                                }}>
                                    {cat}
                                    <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 'normal' }}>({catItems.length})</span>
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

                {/* FAB - Smaller & Discrete */}
                <button
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 60,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        cursor: 'pointer'
                    }}
                    onClick={() => setIsAddrOpen(true)}
                >
                    <Plus size={28} />
                </button>

                {/* Drag Overlay */}
                {createPortal(
                    <DragOverlay dropAnimation={dropAnimation}>
                        {activeItemData ? (
                            <div className="card" style={{ width: '150px', opacity: 0.9, transform: 'rotate(5deg)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                                <div style={{ textAlign: 'center', padding: '12px', fontWeight: 'bold' }}>
                                    {activeItemData.name}
                                </div>
                            </div>
                        ) : null}
                    </DragOverlay>,
                    document.body
                )}

                {/* Toast Notification */}
                {toast.show && (
                    <div style={{
                        position: 'fixed',
                        bottom: '90px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: toast.color || '#374151',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '30px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 100,
                        fontWeight: '500',
                        animation: 'slideUp 0.3s ease-out'
                    }}>
                        {toast.message}
                    </div>
                )}
            </div>

            {/* Modals */}
            {selectedItem && (
                <ItemModal
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            )}
            {isAddrOpen && (
                <AddItemModal
                    onClose={() => setIsAddrOpen(false)}
                />
            )}
        </DndContext>
    );
}
