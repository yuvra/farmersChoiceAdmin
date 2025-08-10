'use client';
// app/products/add/page.tsx
import React from 'react';
import ProductForm from '@/components/ProductForm/ProductForm';

export default function AddProductPage() {
  return (
    <div>
      <h1>➕ Add Product</h1>
      <ProductForm mode="add" />
    </div>
  );
}
