// app/page.tsx
'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>👋 Welcome to Krushi Product Manager</h1>
      <p>Manage agricultural products with multilingual support.</p>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <Link href="/products">
          <button style={{ padding: '0.75rem 1.5rem' }}>🛒 View Products</button>
        </Link>
        <Link href="/products/add">
          <button style={{ padding: '0.75rem 1.5rem' }}>➕ Add Product</button>
        </Link>
      </div>
    </main>
  );
}