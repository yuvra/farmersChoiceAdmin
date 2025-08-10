'use client';
// app/products/page.tsx 
import React, { useEffect } from 'react';
import ProductTable from '@/components/ProductTable/ProductTable';
import { useProductStore } from '@/store/productStore';
import { getAllProducts } from '@/lib/productService';

export default function ProductsPage() {
  const { products, setProducts } = useProductStore();

  useEffect(() => {
    getAllProducts().then(setProducts);
  }, []);

  return (
    <div>
      <h1>🛒 Product List</h1>
      <ProductTable products={products} />
    </div>
  );
}
