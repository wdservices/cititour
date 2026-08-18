import { db } from "@/lib/firebase";
import {
  collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc,
  query, orderBy, serverTimestamp, where
} from "firebase/firestore";
import { uploadImageToCloudinary, type CloudinaryUploadResult } from "@/lib/cloudinary";

export { uploadImageToCloudinary as uploadToCloudinary, type CloudinaryUploadResult };

export interface FoodCategory {
  id?: string;
  name: string;
  slug: string;
  icon?: string;
  displayOrder: number;
  active: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export interface FoodItem {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  image: string;
  gallery?: string[];
  categoryId: string;
  categoryName?: string;
  ingredients?: string;
  preparationTime?: number;
  calories?: number;
  spiceLevel?: "none" | "mild" | "medium" | "hot" | "extra-hot";
  vegetarian?: boolean;
  vegan?: boolean;
  containsNuts?: boolean;
  containsDairy?: boolean;
  containsSeafood?: boolean;
  featured?: boolean;
  complimentary?: boolean;
  available: boolean;
  displayOrder?: number;
  createdAt?: any;
  updatedAt?: any;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Categories ──

export async function addFoodCategory(data: Omit<FoodCategory, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const docRef = await addDoc(collection(db, "foodCategories"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateFoodCategory(id: string, data: Partial<FoodCategory>): Promise<void> {
  await updateDoc(doc(db, "foodCategories", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteFoodCategory(id: string): Promise<void> {
  await deleteDoc(doc(db, "foodCategories", id));
}

export async function getFoodCategories(): Promise<FoodCategory[]> {
  const snap = await getDocs(
    query(collection(db, "foodCategories"), orderBy("displayOrder", "asc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FoodCategory));
}

// ── Items ──

export async function addFoodItem(data: Omit<FoodItem, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const docRef = await addDoc(collection(db, "foodItems"), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateFoodItem(id: string, data: Partial<FoodItem>): Promise<void> {
  await updateDoc(doc(db, "foodItems", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteFoodItem(id: string): Promise<void> {
  await deleteDoc(doc(db, "foodItems", id));
}

export async function getFoodItems(): Promise<FoodItem[]> {
  const snap = await getDocs(
    query(collection(db, "foodItems"), orderBy("displayOrder", "asc"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as FoodItem));
}

export async function getFoodItem(id: string): Promise<FoodItem | null> {
  const snap = await getDoc(doc(db, "foodItems", id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as FoodItem) : null;
}

export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const snap = await getDocs(
    query(collection(db, "foodItems"), where("slug", "==", slug))
  );
  if (excludeId) {
    return snap.docs.some((d) => d.id !== excludeId);
  }
  return !snap.empty;
}

export async function toggleItemAvailability(id: string, available: boolean): Promise<void> {
  await updateDoc(doc(db, "foodItems", id), {
    available,
    updatedAt: serverTimestamp(),
  });
}

export async function duplicateFoodItem(item: FoodItem): Promise<string> {
  const { id: _id, createdAt, updatedAt, ...rest } = item;
  const newSlug = slugify(item.name + " copy");
  const docRef = await addDoc(collection(db, "foodItems"), {
    ...rest,
    name: item.name + " (Copy)",
    slug: newSlug,
    featured: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}
