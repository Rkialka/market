import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Package, Hand } from 'lucide-react'; // Placeholder icon if no image
import { useApp } from '../context/AppContext';

export default function ItemCard({ item, onClick }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: item.id,
        data: item
    });

    const [showMenu, setShowMenu] = useState(false);
    const { markets, addItemToCart, getItemQuantity } = useApp();

    // Get live quantities
    // Get live quantities
    if (!markets || markets.length < 2) return null; // Safety check

    // Safety for potential missing ids
    const m1Id = markets[0]?.id;
    const m2Id = markets[1]?.id;
    if (!m1Id || !m2Id) return null;

    const qty1 = getItemQuantity(m1Id, item.id);
    const qty2 = getItemQuantity(m2Id, item.id);

    // ... swipe logic ...

    const handleAdd = (e, marketId) => {
        e.stopPropagation();
        addItemToCart(marketId, item);
        setShowMenu(false);
        // Dispatch custom event for Toast
        window.dispatchEvent(new CustomEvent('item-added', { detail: { marketName: markets.find(m => m.id === marketId).name } }));
    };

    // Swipe Logic
    const [showQuickActions, setShowQuickActions] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const minSwipeDistance = 50;

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe || isRightSwipe) {
            setShowQuickActions(true);
        }
    };

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'pan-y',
        position: 'relative',
        overflow: 'hidden'
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="card"
            {...listeners}
            {...attributes}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Market Badges */}
            <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '4px', zIndex: 5 }}>
                {qty1 > 0 && (
                    <div style={{ background: 'var(--market1-color)', color: 'white', fontSize: '9px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
                        {markets[0].name.split(' ')[0]}: {qty1}
                    </div>
                )}
                {qty2 > 0 && (
                    <div style={{ background: 'var(--market2-color)', color: 'white', fontSize: '9px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
                        {markets[1].name.split(' ')[0]}: {qty2}
                    </div>
                )}
            </div>

            {/* Drag Indicator (Hand) - kept small */}
            <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                color: '#E5E7EB', // Lighter to not conflict with + button
                zIndex: 10
            }}>
                <Hand size={14} />
            </div>

            {/* Quick Actions (Swipe) - existing code preserved but simplified for this view */}
            {showQuickActions && (
                // ... same as before
                <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.95)', zIndex: 20,
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'center', alignItems: 'center', gap: '8px', borderRadius: '12px'
                }}>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#374151' }}>Enviar para:</div>
                    <button onClick={(e) => handleAdd(e, markets[0].id)} style={{ background: 'var(--market1-color)', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', width: '80%' }}>{markets[0].name}</button>
                    <button onClick={(e) => handleAdd(e, markets[1].id)} style={{ background: 'var(--market2-color)', color: 'white', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', width: '80%' }}>{markets[1].name}</button>
                    <button onClick={(e) => { e.stopPropagation(); setShowQuickActions(false); }} style={{ color: '#6B7280', fontSize: '12px', marginTop: '4px' }}>Cancelar</button>
                </div>
            )}

            {/* Menu Popover (from + button) */}
            {showMenu && (
                <div style={{
                    position: 'absolute', bottom: '40px', right: '8px', background: 'white',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)', borderRadius: '8px', zIndex: 30,
                    padding: '8px', display: 'flex', flexDirection: 'column', gap: '8px',
                    animation: 'slideUp 0.1s ease-out'
                }} onClick={(e) => e.stopPropagation()}>
                    <button
                        onClick={(e) => handleAdd(e, markets[0].id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--market1-color)', fontWeight: '600' }}
                    >
                        + {markets[0].name}
                    </button>
                    <button
                        onClick={(e) => handleAdd(e, markets[1].id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--market2-color)', fontWeight: '600' }}
                    >
                        + {markets[1].name}
                    </button>
                </div>
            )}

            <div
                className="item-content"
                onClick={(e) => {
                    if (!showQuickActions && !showMenu) onClick && onClick();
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center', paddingTop: '16px' }}
            >
                <div style={{
                    position: 'relative', // for + button positioning context
                    width: '60px', height: '60px',
                    background: '#f3f4f6', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px'
                }}>
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} /> : <Package size={24} color="#9CA3AF" />}

                    {/* Plus Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(!showMenu);
                        }}
                        style={{
                            position: 'absolute',
                            bottom: '-8px',
                            right: '-8px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: 'white',
                            border: '1px solid #E5E7EB',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            zIndex: 15,
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: 'var(--primary-color)'
                        }}
                    >
                        +
                    </button>
                </div>
                <div style={{ width: '100%' }}>
                    <div style={{ fontWeight: '600', fontSize: '14px', lineHeight: '1.2', marginBottom: '2px', paddingRight: '0' }}>{item.name}</div>

                    {item.lastPrice ? (
                        <div style={{ fontSize: '11px', color: '#10B981', fontWeight: '500', marginBottom: '4px' }}>
                            ~ R$ {item.lastPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} <span style={{ color: '#9CA3AF', fontWeight: 'normal' }}>(última)</span>
                        </div>
                    ) : (
                        <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '4px' }}>--</div>
                    )}

                    <div style={{ fontSize: '12px', color: '#6B7280' }}>{item.description}</div>
                </div>
            </div>
        </div>
    );
}
