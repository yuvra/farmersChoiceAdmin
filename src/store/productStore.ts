import { create, StateCreator } from 'zustand';
import { Product } from '@/types/product';

type ProductState = {
  products: Product[];
  setProducts: (products: Product[]) => void;
};

const store: StateCreator<ProductState> = (set: any) => ({
  products: [],
  setProducts: (products: Product[]) => set({ products }),
});

export const useProductStore = create<ProductState>(store);
