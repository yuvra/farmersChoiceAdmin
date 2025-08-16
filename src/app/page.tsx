// app/page.tsx
'use client';

import { Typography } from "antd";

export default function Home() {
  return (
    <div style={{ padding: '2rem', color: '#fff' }}>
      <Typography.Title level={2} style={{ color: '#fff' }}>
        👋 Welcome to Farmers Choice Product Manager
      </Typography.Title>
      <Typography.Paragraph style={{ fontSize: '16px', color: '#aaa' }}>
        Use the sidebar to manage products, view orders, and explore analytics.
      </Typography.Paragraph>
    </div>
  );
}
