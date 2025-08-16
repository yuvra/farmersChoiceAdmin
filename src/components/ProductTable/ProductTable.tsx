"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Product } from "@/types/product";
import Link from "next/link";
import {
    Card,
    Row,
    Col,
    Typography,
    Tag,
    Divider,
    Carousel,
    Image,
    Select,
    Input,
} from "antd";
import Fuse from "fuse.js";

const { Title, Paragraph, Text } = Typography;

type Props = { products: Product[]; showFilter?: boolean };

const norm = (s?: string | null) => (s ?? "").trim().toLowerCase();
const stripTags = (html?: string | null) =>
    (html ?? "").replace(/<[^>]+>/g, " ");

function useDebouncedValue<T>(value: T, delay = 300) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);
    return debounced;
}

const ProductTable = ({ products, showFilter = true }: Props) => {
    const [selectedType, setSelectedType] = useState<string | null>("insecticides");
    const [query, setQuery] = useState("");
    const [showOnly, setShowOnly] = useState<"all" | "true" | "false">("true");
    const [stockFilter, setStockFilter] = useState<"all" | "true" | "false">(
        "false"
    );
    const debouncedQuery = useDebouncedValue(query, 300);

    const typeMap = useMemo(() => {
        const map = new Map<string, string>();
        for (const p of products) {
            const raw = p.productType?.en ?? "";
            const key = norm(raw);
            if (key && !map.has(key)) map.set(key, raw.trim());
        }
        return map;
    }, [products]);

    const typeOptions = useMemo(
        () =>
            Array.from(typeMap.entries()).map(([value, label]) => ({
                value,
                label,
            })),
        [typeMap]
    );

    const indexList = useMemo(() => {
        return products.map((p) => ({
            ...p,
            _desc: stripTags(p.productDescription?.en ?? ""),
            _chem: (p.chemicalComposition ?? []).join(" "),
            _variants: (p.mapVariant ?? [])
                .map((v) => v?.title?.en ?? "")
                .filter(Boolean)
                .join(" "),
        }));
    }, [products]);

    const fuse = useMemo(() => {
        return new Fuse(indexList, {
            includeScore: true,
            threshold: 0.35,
            ignoreLocation: true,
            minMatchCharLength: 2,
            keys: [
                "productName.en",
                "vendor",
                "productType.en",
                "_desc",
                "_chem",
                "_variants",
            ],
        });
    }, [indexList]);

    const displayedProducts = useMemo(() => {
        let list = indexList;

        const q = debouncedQuery.trim();
        if (q) {
            const results = fuse.search(q);
            list = results.map((r) => r.item);
        }

        if (showFilter && selectedType) {
            list = list.filter((p) => norm(p.productType?.en) === selectedType);
        }

        if (showOnly !== "all") {
            const boolVal = showOnly === "true";
            list = list.filter((p) => p.showProduct === boolVal);
        }

        if (stockFilter !== "all") {
            const isOut = stockFilter == "true";
            list = list.filter((p) => p.isOutOfStock === isOut);
        }

        // ✅ Sort by position
        list.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

        return list;
    }, [
        indexList,
        fuse,
        debouncedQuery,
        showFilter,
        selectedType,
        showOnly,
        stockFilter,
    ]);

    const showingAll =
        (!showFilter || !selectedType) && !debouncedQuery && showOnly === "all";

    return (
        <div style={{ padding: 24 }}>
            <div
                style={{
                    marginBottom: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 8,
                }}
            >
                <Text style={{ color: "#FFF" }} strong>
                    {showingAll
                        ? `Total Products: ${products.length}`
                        : `Showing ${displayedProducts.length} of ${products.length}`}
                </Text>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <Input.Search
                        allowClear
                        placeholder="Search name, vendor, type, chemical, variant… (typos OK)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onSearch={(v) => setQuery(v)}
                        style={{ width: 320 }}
                    />
                    {showFilter && (
                        <>
                            <Select
                                allowClear
                                placeholder="Select product type"
                                value={selectedType ?? undefined}
                                onChange={(value) =>
                                    setSelectedType(value ?? null)
                                }
                                style={{ width: 200 }}
                                options={typeOptions}
                            />
                            <Select
                                value={showOnly}
                                onChange={(v) => setShowOnly(v)}
                                style={{ width: 160 }}
                                options={[
                                    { label: "All Products", value: "all" },
                                    { label: "Visible Only", value: "true" },
                                    { label: "Hidden Only", value: "false" },
                                ]}
                            />
                            <Select
                                value={stockFilter}
                                onChange={(v) => setStockFilter(v)}
                                style={{ width: 160 }}
                                options={[
                                    { label: "All Stock Status", value: "all" },
                                    { label: "Out of Stock", value: "true" },
                                    { label: "In Stock", value: "false" },
                                ]}
                            />
                        </>
                    )}
                </div>
            </div>

            <Row gutter={[16, 16]}>
                {displayedProducts.map((product: Product) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={product.productId}>
                        <Card
                            hoverable
                            cover={
                                product.productImages?.length ? (
                                    <Carousel autoplay autoplaySpeed={5000}>
                                        {product.productImages.map(
                                            (img, idx) => (
                                                <div key={idx}>
                                                    <Image
                                                        src={img}
                                                        alt={`${
                                                            product.productName
                                                                .en ?? "Product"
                                                        } - ${idx + 1}`}
                                                        style={{
                                                            height: 200,
                                                            width: "100%",
                                                            objectFit: "cover",
                                                            borderRadius: "4px",
                                                        }}
                                                        preview={false}
                                                    />
                                                </div>
                                            )
                                        )}
                                    </Carousel>
                                ) : undefined
                            }
                            actions={[
                                <Link
                                    key="edit"
                                    href={`/products/${product.productId}/edit`}
                                >
                                    ✏️ Edit
                                </Link>,
                            ]}
                        >
                            <Title level={5}>
                                {product.productName.en} |{" "}
                                <span
                                    style={{
                                        color: "#FFD700",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Rank: {product.position}
                                </span>
                            </Title>
                
                            <Paragraph type="secondary">
                                {product.vendor}
                            </Paragraph>
                            <Tag color="geekblue">
                                {product.productType?.en}
                            </Tag>

							<Tag color="gray">
                                {product.isOutOfStock ? "Out of Stock" : "In Stock"}
                            </Tag>

                            <Divider style={{ margin: "10px 0" }} />

                            <Paragraph ellipsis={{ rows: 2 }}>
                                {stripTags(product.productDescription?.en)}
                            </Paragraph>

                            {(product.chemicalComposition ?? []).length > 0 && (
                                <>
                                    <Divider style={{ margin: "10px 0" }} />
                                    <Text strong>🧪 Chemical Composition:</Text>
                                    <ul style={{ paddingLeft: 16 }}>
                                        {(
                                            product.chemicalComposition ?? []
                                        ).map((chem, idx) => (
                                            <li key={idx}>{chem}</li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            {product.mapVariant?.length ? (
                                <>
                                    <Divider style={{ margin: "10px 0" }} />
                                    <Text strong>📦 Variants:</Text>
                                    <ul style={{ paddingLeft: 16 }}>
                                        {product.mapVariant.map(
                                            (variant, idx) => (
                                                <li key={idx}>
                                                    {variant.title?.en} — ₹
                                                    {variant.price}{" "}
                                                    {variant.compareAtPrice ? (
                                                        <Text
                                                            delete
                                                            style={{
                                                                marginLeft: 4,
                                                            }}
                                                        >
                                                            ₹
                                                            {
                                                                variant.compareAtPrice
                                                            }
                                                        </Text>
                                                    ) : null}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </>
                            ) : null}
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default ProductTable;
