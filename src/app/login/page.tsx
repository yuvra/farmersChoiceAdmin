'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
      router.push('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: '100px auto', textAlign: 'center' }}>
      <h2>Admin Login</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ margin: '8px 0', padding: '8px', width: '100%' }}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ margin: '8px 0', padding: '8px', width: '100%' }}
      />
      <button onClick={login} style={{ marginTop: 12, padding: '8px 16px' }}>
        Login
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
