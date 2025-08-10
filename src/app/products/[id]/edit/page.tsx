'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '@/components/ProductForm/ProductForm';

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string; // typecast because it's `string | string[] | undefined`

  return (
    <div>
      <h1>✏️ Edit Product</h1>
      <ProductForm mode="edit" productId={id} />
    </div>
  );
}