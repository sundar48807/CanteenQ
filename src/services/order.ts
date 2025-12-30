import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";

// READ (replaces GET localhost)
export async function getOrders() {
  const snapshot = await getDocs(collection(db, "orders"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// WRITE (replaces POST localhost)
export async function createOrder(order: any) {
  await addDoc(collection(db, "orders"), order);
}