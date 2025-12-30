import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Token, TokenStatus, Dish, MenuItem } from '../../types';

// Collections
const TOKENS_COLLECTION = 'tokens';
const DISH_OF_THE_DAY_COLLECTION = 'dishOfTheDay';
const MENU_ITEMS_COLLECTION = 'menuItems';

// Default menu items
const defaultMenuItems: MenuItem[] = [
  { id: 's1', name: 'Veggie Delight Sandwich', category: 'Sandwiches', price: '₹120', isAvailable: true },
  { id: 's2', name: 'Chicken Tikka Sandwich', category: 'Sandwiches', price: '₹150', isAvailable: true },
  { id: 'p1', name: 'Margherita Pizza', category: 'Pizza', price: '₹250', isAvailable: true },
  { id: 'p2', name: 'Pepperoni Pizza', category: 'Pizza', price: '₹300', isAvailable: true },
  { id: 'sa1', name: 'Classic Caesar Salad', category: 'Salads', price: '₹180', isAvailable: true },
  { id: 'b1', name: 'Espresso Coffee', category: 'Beverages', price: '₹80', isAvailable: true },
  { id: 'b2', name: 'Iced Tea', category: 'Beverages', price: '₹70', isAvailable: true },
];

// Tokens operations
export const getTokens = async (): Promise<Token[]> => {
  const q = query(collection(db, TOKENS_COLLECTION), orderBy('id'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.data().id,
    customerName: doc.data().customerName,
    phoneNumber: doc.data().phoneNumber,
    status: doc.data().status,
    bookingTime: doc.data().bookingTime.toDate(),
    statusChangeTime: doc.data().statusChangeTime.toDate(),
  }));
};

export const addToken = async (token: Token): Promise<void> => {
  await addDoc(collection(db, TOKENS_COLLECTION), {
    ...token,
    bookingTime: token.bookingTime,
    statusChangeTime: token.statusChangeTime,
  });
};

export const updateToken = async (tokenId: number, updates: Partial<Token>): Promise<void> => {
  const q = query(collection(db, TOKENS_COLLECTION));
  const snapshot = await getDocs(q);
  const tokenDoc = snapshot.docs.find(doc => doc.data().id === tokenId);
  if (tokenDoc) {
    await updateDoc(tokenDoc.ref, updates);
  }
};

export const deleteToken = async (tokenId: number): Promise<void> => {
  const q = query(collection(db, TOKENS_COLLECTION));
  const snapshot = await getDocs(q);
  const tokenDoc = snapshot.docs.find(doc => doc.data().id === tokenId);
  if (tokenDoc) {
    await deleteDoc(tokenDoc.ref);
  }
};

export const subscribeToTokens = (callback: (tokens: Token[]) => void) => {
  const q = query(collection(db, TOKENS_COLLECTION), orderBy('id'));
  return onSnapshot(q, (snapshot) => {
    const tokens = snapshot.docs.map(doc => ({
      id: doc.data().id,
      customerName: doc.data().customerName,
      phoneNumber: doc.data().phoneNumber,
      status: doc.data().status,
      bookingTime: doc.data().bookingTime.toDate(),
      statusChangeTime: doc.data().statusChangeTime.toDate(),
    }));
    callback(tokens);
  });
};

// Dish of the day operations
export const getDishOfTheDay = async (): Promise<Dish | null> => {
  const snapshot = await getDocs(collection(db, DISH_OF_THE_DAY_COLLECTION));
  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    return {
      name: doc.data().name,
      description: doc.data().description,
    };
  }
  return null;
};

export const setDishOfTheDay = async (dish: Dish): Promise<void> => {
  const snapshot = await getDocs(collection(db, DISH_OF_THE_DAY_COLLECTION));
  if (!snapshot.empty) {
    // Update existing
    await updateDoc(snapshot.docs[0].ref, dish as any);
  } else {
    // Create new
    await addDoc(collection(db, DISH_OF_THE_DAY_COLLECTION), dish as any);
  }
};

export const subscribeToDishOfTheDay = (callback: (dish: Dish | null) => void) => {
  return onSnapshot(collection(db, DISH_OF_THE_DAY_COLLECTION), (snapshot) => {
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      callback({
        name: doc.data().name,
        description: doc.data().description,
      });
    } else {
      callback(null);
    }
  });
};

// Menu items operations
export const getMenuItems = async (): Promise<MenuItem[]> => {
  const snapshot = await getDocs(collection(db, MENU_ITEMS_COLLECTION));
  if (!snapshot.empty) {
    return snapshot.docs.map(doc => ({
      id: doc.data().id,
      name: doc.data().name,
      category: doc.data().category,
      price: doc.data().price,
      isAvailable: doc.data().isAvailable,
    }));
  }
  // Initialize with default menu items if none exist
  await initializeMenuItems();
  return defaultMenuItems;
};

export const initializeMenuItems = async (): Promise<void> => {
  const batch = [];
  for (const item of defaultMenuItems) {
    batch.push(addDoc(collection(db, MENU_ITEMS_COLLECTION), item));
  }
  await Promise.all(batch);
};

export const updateMenuItem = async (itemId: string, updates: Partial<MenuItem>): Promise<void> => {
  const q = query(collection(db, MENU_ITEMS_COLLECTION));
  const snapshot = await getDocs(q);
  const itemDoc = snapshot.docs.find(doc => doc.data().id === itemId);
  if (itemDoc) {
    await updateDoc(itemDoc.ref, updates);
  }
};

export const subscribeToMenuItems = (callback: (menuItems: MenuItem[]) => void) => {
  return onSnapshot(collection(db, MENU_ITEMS_COLLECTION), (snapshot) => {
    const menuItems = snapshot.docs.map(doc => ({
      id: doc.data().id,
      name: doc.data().name,
      category: doc.data().category,
      price: doc.data().price,
      isAvailable: doc.data().isAvailable,
    }));
    callback(menuItems);
  });
};
