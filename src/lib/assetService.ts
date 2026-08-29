import { db } from "@/lib/firebase";
import {
  collection, getDocs, getDoc, addDoc, deleteDoc, doc,
  query, orderBy, serverTimestamp,
} from "firebase/firestore";
import { uploadImageToCloudinary, type CloudinaryUploadResult } from "@/lib/cloudinary";

export interface Asset {
  id?: string;
  url: string;
  publicId: string;
  folder: string;
  originalName: string;
  uploadedBy?: string;
  createdAt?: any;
}

const ASSETS_COLLECTION = "assets";

export async function uploadAsset(file: File, folder: string = "general"): Promise<Asset> {
  const result: CloudinaryUploadResult = await uploadImageToCloudinary(file, { folder });
  const assetData: Omit<Asset, "id"> = {
    url: result.secureUrl,
    publicId: result.publicId,
    folder,
    originalName: file.name,
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, ASSETS_COLLECTION), assetData);
  return { id: docRef.id, ...assetData } as Asset;
}

export async function getAssets(): Promise<Asset[]> {
  const snap = await getDocs(
    query(collection(db, ASSETS_COLLECTION), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Asset[];
}

export async function getAssetById(id: string): Promise<Asset | null> {
  const snap = await getDoc(doc(db, ASSETS_COLLECTION, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Asset) : null;
}

export async function deleteAsset(id: string): Promise<void> {
  const asset = await getAssetById(id);
  if (asset?.publicId) {
    try {
      await fetch("/api/uploads/destroy", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: asset.publicId }),
      });
    } catch { /* best effort */ }
  }
  await deleteDoc(doc(db, ASSETS_COLLECTION, id));
}

export async function deleteAssets(ids: string[]): Promise<void> {
  await Promise.all(ids.map((id) => deleteAsset(id)));
}