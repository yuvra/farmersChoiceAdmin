"use client";

import { Layout, Menu, ConfigProvider, theme as antdTheme } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Header, Content, Sider } = Layout;

const items = [
  { key: "/", label: <Link href="/">🏠 Home</Link> },
  { key: "/products", label: <Link href="/products">🛒 View Products</Link> },
  { key: "/products/add", label: <Link href="/products/add">➕ Add Product</Link> },
  { key: "/ordersPage", label: <Link href="/ordersPage">📦 Show Orders</Link> },
  { key: "/analytics", label: <Link href="/analytics">📊 Show Analytics</Link> },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ConfigProvider
      theme={{
        algorithm: antdTheme.darkAlgorithm,
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sider width={220}>
          <div
            style={{
            //   padding: "1rem",
              fontWeight: "bold",
              fontSize: "1.2rem",
              textAlign: "center",
              color: "#fff",
            }}
          >
            🧑‍🌾 Farmers Choice
          </div>
          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            items={items}
            theme="dark"
          />
        </Sider>
        <Layout>
          
          <Content
            style={{
            
            //   padding: "24px",
              background: "#1f1f1f",
              minHeight: 280,
              color: "#fff",
              height: '100vh',
              overflowY: 'scroll',
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
