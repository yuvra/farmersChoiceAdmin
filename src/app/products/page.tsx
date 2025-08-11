"use client";
// app/products/page.tsx
import React, { useEffect, useState, useCallback } from "react";
import { Spin, Alert, Button } from "antd";
import ProductTable from "@/components/ProductTable/ProductTable";
import { useProductStore } from "@/store/productStore";
import { getAllProducts } from "@/lib/productService";

export default function ProductsPage() {
    const { products, setProducts } = useProductStore();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProducts = useCallback(async () => {
        try {
            setError(null);
            setLoading(true);
            const data = await getAllProducts();
            setProducts(data);
        } catch (e: any) {
            setError(e?.message || "Failed to load products");
        } finally {
            setLoading(false);
        }
    }, [setProducts]);

    useEffect(() => {
        void loadProducts();
    }, [loadProducts]);

    if (loading) {
        return (
            <div
                style={{
                    display: "grid",
                    placeItems: "center",
                    minHeight: "40vh",
                }}
            >
                <Spin size="large" tip="Loading products..." />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ maxWidth: 500, margin: "0 auto", padding: 20 }}>
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    action={
                        <Button size="small" onClick={loadProducts}>
                            Retry
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div>
            <h1>🛒 Product List</h1>
            <ProductTable products={products} />
        </div>
    );
}
