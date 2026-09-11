'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/ordersPage');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(145deg, #1a3520, #0f1f12)',
        padding: 24,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 360,
          background: '#fff',
          borderRadius: 14,
          padding: '28px 24px',
          boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
        }}
      >
        <p style={{ color: '#3d7a45', fontWeight: 700, marginBottom: 4 }}>
          Farmers Choice
        </p>
        <h2 style={{ margin: '0 0 16px', color: '#142014' }}>Admin Login</h2>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            margin: '8px 0',
            padding: '10px 12px',
            width: '100%',
            borderRadius: 8,
            border: '1px solid #ddd',
            boxSizing: 'border-box',
          }}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            margin: '8px 0',
            padding: '10px 12px',
            width: '100%',
            borderRadius: 8,
            border: '1px solid #ddd',
            boxSizing: 'border-box',
          }}
        />
        <button
          onClick={login}
          style={{
            marginTop: 12,
            padding: '10px 16px',
            width: '100%',
            borderRadius: 8,
            border: 'none',
            background: '#3d7a45',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Login
        </button>
        {error && (
          <p style={{ color: '#c0392b', marginTop: 10, fontSize: 14 }}>{error}</p>
        )}
        <p style={{ marginTop: 16, fontSize: 14 }}>
          <Link href="/" style={{ color: '#3d7a45' }}>
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
