import { useState, useEffect, useCallback } from 'react';
import { Token, TokenStatus, Dish, MenuItem } from '../types';

const STORAGE_KEY = 'canteen_queue';
const DISH_OF_THE_DAY_KEY = 'canteen_dish_of_the_day';
const MENU_STORAGE_KEY = 'canteen_menu';

// Helper to handle Date objects during JSON serialization/deserialization
const reviver = (key: string, value: any) => {
    if ((key === 'bookingTime' || key === 'statusChangeTime') && typeof value === 'string') {
        return new Date(value);
    }
    return value;
};

const defaultMenuItems: MenuItem[] = [
  { id: 's1', name: 'Veggie Delight Sandwich', category: 'Sandwiches', price: '₹120', isAvailable: true },
  { id: 's2', name: 'Chicken Tikka Sandwich', category: 'Sandwiches', price: '₹150', isAvailable: true },
  { id: 'p1', name: 'Margherita Pizza', category: 'Pizza', price: '₹250', isAvailable: true },
  { id: 'p2', name: 'Pepperoni Pizza', category: 'Pizza', price: '₹300', isAvailable: true },
  { id: 'sa1', name: 'Classic Caesar Salad', category: 'Salads', price: '₹180', isAvailable: true },
  { id: 'b1', name: 'Espresso Coffee', category: 'Beverages', price: '₹80', isAvailable: true },
  { id: 'b2', name: 'Iced Tea', category: 'Beverages', price: '₹70', isAvailable: true },
];

export const useQueue = () => {
    const [tokens, setTokens] = useState<Token[]>(() => {
        try {
            const storedTokens = localStorage.getItem(STORAGE_KEY);
            return storedTokens ? JSON.parse(storedTokens, reviver) : [];
        } catch (error) {
            console.error("Error reading tokens from localStorage", error);
            return [];
        }
    });

    const [dishOfTheDay, setDishOfTheDay] = useState<Dish | null>(() => {
        try {
            const storedDish = localStorage.getItem(DISH_OF_THE_DAY_KEY);
            return storedDish ? JSON.parse(storedDish) : null;
        } catch (error) {
            console.error("Error reading dish of the day from localStorage", error);
            return null;
        }
    });

    const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
        try {
            const storedMenu = localStorage.getItem(MENU_STORAGE_KEY);
            return storedMenu ? JSON.parse(storedMenu) : defaultMenuItems;
        } catch (error) {
            console.error("Error reading menu from localStorage", error);
            return defaultMenuItems;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
        } catch (error) {
            console.error("Error writing tokens to localStorage", error);
        }
    }, [tokens]);
    
    useEffect(() => {
        try {
            localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(menuItems));
        } catch (error) {
            console.error("Error writing menu to localStorage", error);
        }
    }, [menuItems]);

    useEffect(() => {
        try {
            if (dishOfTheDay) {
                localStorage.setItem(DISH_OF_THE_DAY_KEY, JSON.stringify(dishOfTheDay));
            } else {
                localStorage.removeItem(DISH_OF_THE_DAY_KEY);
            }
        } catch (error) {
            console.error("Error writing dish of the day to localStorage", error);
        }
    }, [dishOfTheDay]);
    
    // Effect for auto-completing stale 'READY' tokens
    useEffect(() => {
        const AUTO_COMPLETE_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes

        const intervalId = setInterval(() => {
            setTokens(prevTokens => {
                let hasChanges = false;
                const updatedTokens = prevTokens.map(token => {
                    if (token.status === TokenStatus.READY && token.statusChangeTime) {
                        const timeInReadyState = new Date().getTime() - new Date(token.statusChangeTime).getTime();
                        if (timeInReadyState > AUTO_COMPLETE_THRESHOLD_MS) {
                            hasChanges = true;
                            // Also update statusChangeTime for the new COMPLETED state
                            return { ...token, status: TokenStatus.COMPLETED, statusChangeTime: new Date() };
                        }
                    }
                    return token;
                });
                // Only trigger a re-render if a token was actually changed
                return hasChanges ? updatedTokens : prevTokens;
            });
        }, 30 * 1000); // Check every 30 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []); // Empty dependency array ensures this runs only once

    const addToken = useCallback((customerName: string, phoneNumber: string): Token => {
        const newId = tokens.length > 0 ? Math.max(...tokens.map(t => t.id)) + 1 : 101;
        const newToken: Token = {
            id: newId,
            customerName,
            phoneNumber,
            status: TokenStatus.WAITING,
            bookingTime: new Date(),
            statusChangeTime: new Date(),
        };
        setTokens(prevTokens => [...prevTokens, newToken]);
        return newToken;
    }, [tokens]);

    const updateTokenStatus = useCallback((tokenId: number, newStatus: TokenStatus) => {
        setTokens(prevTokens =>
            prevTokens.map(token =>
                token.id === tokenId ? { ...token, status: newStatus, statusChangeTime: new Date() } : token
            )
        );
    }, []);
    
    const updateDishOfTheDay = useCallback((dish: Dish) => {
        setDishOfTheDay(dish);
    }, []);

    const clearCompletedTokens = useCallback(() => {
        setTokens(prevTokens => prevTokens.filter(token => token.status !== TokenStatus.COMPLETED));
    }, []);
    
    const toggleMenuItemAvailability = useCallback((itemId: string) => {
        setMenuItems(prevItems => 
            prevItems.map(item => 
                item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
            )
        );
    }, []);

    return { tokens, addToken, updateTokenStatus, dishOfTheDay, updateDishOfTheDay, clearCompletedTokens, menuItems, toggleMenuItemAvailability };
};