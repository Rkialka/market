import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ITEMS, INITIAL_MARKETS, CATEGORIES } from '../data/initialData';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // State initialization with localStorage check - UPDATED VERSION KEY to force reset
    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem('market_items_v2');
        return saved ? JSON.parse(saved) : INITIAL_ITEMS;
    });

    const [markets, setMarkets] = useState(() => {
        const saved = localStorage.getItem('market_configs_v2');
        return saved ? JSON.parse(saved) : INITIAL_MARKETS;
    });

    // Planned Quantities for Step 1 (Planning Phase)
    // Structure: { [itemId]: number }
    const [plannedItems, setPlannedItems] = useState(() => {
        const saved = localStorage.getItem('market_planned_v2');
        return saved ? JSON.parse(saved) : {};
    });

    const [carts, setCarts] = useState(() => {
        const saved = localStorage.getItem('market_carts_v2');
        return saved ? JSON.parse(saved) : { m1: [], m2: [] };
    });

    const [currentScreen, setCurrentScreen] = useState({ name: 'HOME', params: {} });

    // Persistence with V2 keys
    useEffect(() => { localStorage.setItem('market_items_v2', JSON.stringify(items)); }, [items]);
    useEffect(() => { localStorage.setItem('market_configs_v2', JSON.stringify(markets)); }, [markets]);
    useEffect(() => { localStorage.setItem('market_planned_v2', JSON.stringify(plannedItems)); }, [plannedItems]);
    useEffect(() => { localStorage.setItem('market_carts_v2', JSON.stringify(carts)); }, [carts]);

    // Actions
    const updatePlannedQuantity = (itemId, change) => {
        setPlannedItems(prev => {
            const currentQty = prev[itemId] || 0;
            const newQty = Math.max(0, currentQty + change);
            if (newQty === 0) {
                const { [itemId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [itemId]: newQty };
        });
    };

    const getPlannedStats = () => {
        let count = 0;
        let total = 0;
        Object.entries(plannedItems).forEach(([itemId, qty]) => {
            if (qty > 0) {
                const item = items.find(i => i.id === itemId);
                if (item) {
                    count += qty;
                    // Determine reference price: min of existing prices
                    const p1 = item.lastPrice_m1 || Infinity;
                    const p2 = item.lastPrice_m2 || Infinity;
                    const refPrice = Math.min(p1, p2);
                    if (refPrice !== Infinity) {
                        total += qty * refPrice;
                    }
                }
            }
        });
        return { count, total };
    };

    // Existing Cart Logic (Preserved for Step 2 later)
    const addItemToCart = (marketId, item) => {
        // ... (Logic remains, can be triggered in Step 2)
        setCarts(prev => {
            // Simplified for now - assumes we might push planned items later
            // For now just keep existing logic functional if needed
            const currentCart = prev[marketId] || [];
            const existingItemIndex = currentCart.findIndex(i => i.originalId === item.id);

            if (existingItemIndex > -1) {
                const newCart = [...currentCart];
                newCart[existingItemIndex] = {
                    ...newCart[existingItemIndex],
                    quantity: (newCart[existingItemIndex].quantity || 1) + 1
                };
                return { ...prev, [marketId]: newCart };
            } else {
                const cartItem = {
                    ...item,
                    cartItemId: uuidv4(),
                    originalId: item.id,
                    quantity: 1
                };
                return { ...prev, [marketId]: [...currentCart, cartItem] };
            }
        });
    };

    const removeItemOneByOne = (marketId, cartItemId) => {
        setCarts(prev => {
            const currentCart = prev[marketId] || [];
            const itemIndex = currentCart.findIndex(i => i.cartItemId === cartItemId);
            if (itemIndex === -1) return prev;
            const item = currentCart[itemIndex];
            if ((item.quantity || 1) > 1) {
                const newCart = [...currentCart];
                newCart[itemIndex] = { ...item, quantity: item.quantity - 1 };
                return { ...prev, [marketId]: newCart };
            } else {
                return { ...prev, [marketId]: prev[marketId].filter(i => i.cartItemId !== cartItemId) };
            }
        });
    };

    const removeItemFromCart = (marketId, cartItemId) => {
        setCarts(prev => ({
            ...prev,
            [marketId]: prev[marketId].filter(i => i.cartItemId !== cartItemId)
        }));
    };

    const getCartStats = (marketId) => {
        const cart = carts[marketId] || [];
        const uniqueItems = cart.length;
        const totalUnits = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        // Uses m1 or m2 specific price logic if available, or fallback
        // For CartView relative calculation
        const estimatedTotal = cart.reduce((sum, item) => {
            // Check if item has market specific price in its data
            // In step 2, we should probably ensure cart items have the latest prices attached
            // For now, fallback to generic lastPrice is GONE. Need logic.
            const p = marketId === 'm1' ? (item.lastPrice_m1 || 0) : (item.lastPrice_m2 || 0);
            return sum + ((item.quantity || 1) * p);
        }, 0);
        return { uniqueItems, totalUnits, estimatedTotal };
    };

    const getItemQuantity = (marketId, itemId) => {
        const cart = carts[marketId] || [];
        const item = cart.find(i => i.originalId === itemId);
        return item ? (item.quantity || 0) : 0;
    };

    const reorderCart = (marketId, newItems) => {
        setCarts(prev => ({ ...prev, [marketId]: newItems }));
    };

    const clearCart = (marketId) => {
        setCarts(prev => ({ ...prev, [marketId]: [] }));
    };

    const updateMarket = (updatedMarket) => {
        setMarkets(prev => prev.map(m => m.id === updatedMarket.id ? updatedMarket : m));
    };

    const addNewItem = (newItem) => {
        setItems(prev => [...prev, { ...newItem, id: uuidv4() }]);
    };

    const updateItem = (updatedItem) => {
        setItems(prev => prev.map(i => i.id === updatedItem.id ? updatedItem : i));
    };

    const deleteItem = (id) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const navigate = (screenName, params = {}) => {
        setCurrentScreen({ name: screenName, params });
    };

    return (
        <AppContext.Provider value={{
            items, categories: CATEGORIES, markets, carts, plannedItems,
            addItemToCart, removeItemFromCart, reorderCart, clearCart,
            updateMarket, addNewItem, updateItem, deleteItem, updatePlannedQuantity, getPlannedStats,
            currentScreen, navigate, getCartStats, getItemQuantity, removeItemOneByOne
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
