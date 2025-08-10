import { db } from '@/firebase/config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  addDoc,
  deleteDoc,
  QueryDocumentSnapshot,
  DocumentData
} from 'firebase/firestore';
import { Product } from '@/types/product';

const productCollection = collection(db, 'products');

// Helper: Remove productId before saving
const removeProductId = (product: Product): Omit<Product, 'productId'> => {
  const { productId, ...rest } = product;
  return rest;
};

// 🔍 Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(productCollection);
  return snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
    ...(doc.data() as Product),
    productId: doc.id,
  }));
};

// 🔍 Get single product by ID
export const getProductById = async (id: string): Promise<Product | null> => {
  const ref = doc(db, 'products', id);
  const docSnap = await getDoc(ref);
  return docSnap.exists() ? { ...(docSnap.data() as Product), productId: id } : null;
};

// ➕ Add new product
export const addProduct = async (product: Product): Promise<void> => {
  const data = removeProductId(product);
  await addDoc(productCollection, data);
};

// 🔄 Update existing product
export const updateProduct = async (id: string, product: Product): Promise<void> => {
  const ref = doc(db, 'products', id);
  const data = removeProductId(product);
  await updateDoc(ref, data);
};

// ❌ Delete product
export const deleteProduct = async (id: string): Promise<void> => {
  const ref = doc(db, 'products', id);
  await deleteDoc(ref);
};
