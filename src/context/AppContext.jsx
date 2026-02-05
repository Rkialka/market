import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ITEMS, INITIAL_MARKETS, CATEGORIES } from '../data/initialData';
import { v4 as uuidv4 } from 'uuid';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // State initialization with localStorage check
    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem('market_items');
        return saved ? JSON.parse(saved) : INITIAL_ITEMS;
    });

    const [markets, setMarkets] = useState(() => {
        const saved = localStorage.getItem('market_configs');
        return saved ? JSON.parse(saved) : INITIAL_MARKETS;
    });

    const [carts, setCarts] = useState(() => {
        const saved = localStorage.getItem('market_carts');
        return saved ? JSON.parse(saved) : { m1: [], m2: [] };
    });

    const [currentScreen, setCurrentScreen] = useState({ name: 'HOME', params: {} });

    // Persistence
    useEffect(() => { localStorage.setItem('market_items', JSON.stringify(items)); }, [items]);
    useEffect(() => { localStorage.setItem('market_configs', JSON.stringify(markets)); }, [markets]);
    useEffect(() => { localStorage.setItem('market_carts', JSON.stringify(carts)); }, [carts]);

    // Actions
    const addItemToCart = (marketId, item) => {
        setCarts(prev => {
            const currentCart = prev[marketId] || [];

            // Check if item already exists in cart (based on originalId)
            const existingItemIndex = currentCart.findIndex(i => i.originalId === item.id);

            if (existingItemIndex > -1) {
                // Determine quantity to add. If item being added has quantity, use it (e.g. from drag data if we track dragged qty), else default to 1
                // For now, simple drag/click adds +1
                const newCart = [...currentCart];
                newCart[existingItemIndex] = {
                    ...newCart[existingItemIndex],
                    quantity: (newCart[existingItemIndex].quantity || 1) + 1
                };
                return { ...prev, [marketId]: newCart };
            } else {
                // Add new item with quantity 1
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
                // Decrease quantity
                const newCart = [...currentCart];
                newCart[itemIndex] = { ...item, quantity: item.quantity - 1 };
                return { ...prev, [marketId]: newCart };
            } else {
                // Remove completely
                return {
                    ...prev,
                    [marketId]: prev[marketId].filter(i => i.cartItemId !== cartItemId)
                };
            }
        });
    };

    const removeItemFromCart = (marketId, cartItemId) => {
        setCarts(prev => ({
            ...prev,
            [marketId]: prev[marketId].filter(i => i.cartItemId !== cartItemId) // Fully remove
        }));
    };

    // Helper to get total units
    const getCartStats = (marketId) => {
        const cart = carts[marketId] || [];
        const uniqueItems = cart.length;
        const totalUnits = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const estimatedTotal = cart.reduce((sum, item) => sum + ((item.quantity || 1) * (item.lastPrice || 0)), 0);
        return { uniqueItems, totalUnits, estimatedTotal };
    };

    // Helper to get quantity of an item in a specific market
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
            items, categories: CATEGORIES, markets, carts,
            addItemToCart, removeItemFromCart, reorderCart, clearCart,
            updateMarket, addNewItem, updateItem, deleteItem,
            currentScreen, navigate, getCartStats, getItemQuantity, removeItemOneByOne
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
