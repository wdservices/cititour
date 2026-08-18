import { db } from "@/lib/firebase";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc,
  query, orderBy, where, serverTimestamp, limit
} from "firebase/firestore";

export interface FoodOrderItem {
  foodItemId: string;
  name: string;
  price: number;
  complimentary: boolean;
  quantity: number;
  subtotal: number;
}

export interface FoodOrder {
  id?: string;
  orderNumber: string;
  unitName: string;
  unitId: string;
  items: FoodOrderItem[];
  totalAmount: number;
  specialInstructions: string;
  status: "pending" | "preparing" | "ready" | "delivered";
  createdAt?: any;
  createdBy: string;
}

export async function generateOrderNumber(): Promise<string> {
  const snap = await getDocs(
    query(collection(db, "foodOrders"), orderBy("createdAt", "desc"), limit(1))
  );
  let nextNum = 1;
  if (!snap.empty) {
    const last = snap.docs[0].data().orderNumber as string;
    const match = last.match(/FOD-(\d+)/);
    if (match) nextNum = parseInt(match[1], 10) + 1;
  }
  return `FOD-${String(nextNum).padStart(3, "0")}`;
}

export async function addFoodOrder(data: Omit<FoodOrder, "id" | "createdAt">): Promise<string> {
  const docRef = await addDoc(collection(db, "foodOrders"), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateFoodOrder(id: string, data: Partial<FoodOrder>): Promise<void> {
  await updateDoc(doc(db, "foodOrders", id), { ...data });
}

export async function deleteFoodOrder(id: string): Promise<void> {
  await deleteDoc(doc(db, "foodOrders", id));
}

export async function getAllFoodOrders(): Promise<FoodOrder[]> {
  const snap = await getDocs(
    query(collection(db, "foodOrders"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FoodOrder));
}

export async function getTodayFoodOrders(): Promise<FoodOrder[]> {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const snap = await getDocs(
    query(
      collection(db, "foodOrders"),
      where("createdAt", ">=", startOfDay),
      orderBy("createdAt", "desc")
    )
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FoodOrder));
}
