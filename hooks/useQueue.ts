import { useState, useEffect, useCallback } from 'react';
import { Token, TokenStatus, Dish, MenuItem } from '../types';
import {
    getTokens,
    addToken as addTokenToFirestore,
    updateToken as updateTokenInFirestore,
    deleteToken,
    subscribeToTokens,
    getDishOfTheDay,
    setDishOfTheDay as setDishOfTheDayInFirestore,
    subscribeToDishOfTheDay,
    getMenuItems,
    updateMenuItem as updateMenuItemInFirestore,
    subscribeToMenuItems
} from '../src/services/queueService';

export const useQueue = () => {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [dishOfTheDay, setDishOfTheDay] = useState<Dish | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load initial data
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [tokensData, dishData, menuData] = await Promise.all([
                    getTokens(),
                    getDishOfTheDay(),
                    getMenuItems()
                ]);
                setTokens(tokensData);
                setDishOfTheDay(dishData);
                setMenuItems(menuData);
            } catch (error) {
                console.error("Error loading initial data", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, []);

    // Subscribe to real-time updates
    useEffect(() => {
        const unsubscribeTokens = subscribeToTokens(setTokens);
        const unsubscribeDish = subscribeToDishOfTheDay(setDishOfTheDay);
        const unsubscribeMenu = subscribeToMenuItems(setMenuItems);

        return () => {
            unsubscribeTokens();
            unsubscribeDish();
            unsubscribeMenu();
        };
    }, []);
    
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

    const addToken = useCallback(async (customerName: string, phoneNumber: string): Promise<Token> => {
        const newId = tokens.length > 0 ? Math.max(...tokens.map(t => t.id)) + 1 : 101;
        const newToken: Token = {
            id: newId,
            customerName,
            phoneNumber,
            status: TokenStatus.WAITING,
            bookingTime: new Date(),
            statusChangeTime: new Date(),
        };
        await addTokenToFirestore(newToken);
        return newToken;
    }, [tokens]);

    const updateTokenStatus = useCallback(async (tokenId: number, newStatus: TokenStatus) => {
        await updateTokenInFirestore(tokenId, { status: newStatus, statusChangeTime: new Date() });
    }, []);

    const updateDishOfTheDay = useCallback(async (dish: Dish) => {
        await setDishOfTheDayInFirestore(dish);
    }, []);

    const clearCompletedTokens = useCallback(async () => {
        const completedTokens = tokens.filter(token => token.status === TokenStatus.COMPLETED);
        await Promise.all(completedTokens.map(token => deleteToken(token.id)));
    }, [tokens]);

    const toggleMenuItemAvailability = useCallback(async (itemId: string) => {
        const item = menuItems.find(item => item.id === itemId);
        if (item) {
            await updateMenuItemInFirestore(itemId, { isAvailable: !item.isAvailable });
        }
    }, [menuItems]);

    return { tokens, addToken, updateTokenStatus, dishOfTheDay, updateDishOfTheDay, clearCompletedTokens, menuItems, toggleMenuItemAvailability };
};