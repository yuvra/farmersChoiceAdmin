"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Product } from "@/types/product";
import Link from "next/link";
import {
  Card, Row, Col, Typography, Tag, Divider, Carousel, Image, Select, Input,
} from "antd";
import Fuse from "fuse.js";

const { Title, Paragraph, Text } = Typography;

type Props = { products: Product[]; showFilter?: boolean };

const norm = (s?: string | null) => (s ?? "").trim().toLowerCase();
const stripTags = (html?: string | null) => (html ?? "").replace(/<[^>]+>/g, " ");

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

const ProductTable = ({ products, showFilter = true }: Props) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 300);

  // Build normalized type -> display label map (English)
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
    () => Array.from(typeMap.entries()).map(([value, label]) => ({ value, label })),
    [typeMap]
  );

  // Prepare a preprocessed list for fuzzy search (flatten English fields)
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

  // Fuse instance (typo tolerant)
  const fuse = useMemo(() => {
    return new Fuse(indexList, {
      includeScore: true,
      threshold: 0.35,        // ↑ more tolerant (0.0 exact … 1.0 very fuzzy)
      ignoreLocation: true,   // match anywhere in the string
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

  // Default to "Fungicide" only when filter is shown and present (English)
  // useEffect(() => {
  //   if (!showFilter) {
  //     setSelectedType(null);
  //     return;
  //   }
  //   const fungKey = norm("Fungicide");
  //   if (typeMap.has(fungKey)) setSelectedType(fungKey);
  //   else setSelectedType(null);
  // }, [showFilter, typeMap]);

  // Fuzzy search first (covers exact + typos), then apply type filter
  const displayedProducts = useMemo(() => {
    let list = indexList;

    const q = debouncedQuery.trim();
    if (q) {
      const results = fuse.search(q);
      // Keep Fuse order (best matches first)
      list = results.map((r) => r.item);
    }

    if (showFilter && selectedType) {
      list = list.filter((p) => norm(p.productType?.en) === selectedType);
    }

    return list;
  }, [indexList, fuse, debouncedQuery, showFilter, selectedType]);

  const showingAll = (!showFilter || !selectedType) && !debouncedQuery;

  return (
    <div style={{ padding: 24 }}>
      {/* Top bar */}
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
              <Text style={{ color: "#FFF" }} strong>
                Filter by Type:{" "}
              </Text>
              <Select
                allowClear
                placeholder="Select product type"
                value={selectedType ?? undefined}
                onChange={(value) => setSelectedType(value ?? null)}
                style={{ width: 220 }}
                options={typeOptions}
              />
            </>
          )}
        </div>
      </div>

      {/* Product Grid */}
      <Row gutter={[16, 16]}>
        {displayedProducts.map((product: Product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.productId}>
            <Card
              hoverable
              cover={
                product.productImages?.length ? (
                  <Carousel autoplay autoplaySpeed={5000}>
                    {product.productImages.map((img, idx) => (
                      <div key={idx}>
                        <Image
                          src={img}
                          alt={`${product.productName.en ?? "Product"} - ${idx + 1}`}
                          style={{
                            height: 200,
                            width: "100%",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                          preview={false}
                        />
                      </div>
                    ))}
                  </Carousel>
                ) : undefined
              }
              actions={[
                <Link key="edit" href={`/products/${product.productId}/edit`}>
                  ✏️ Edit
                </Link>,
              ]}
            >
              <Title level={5}>{product.productName.en}</Title>
              <Paragraph type="secondary">{product.vendor}</Paragraph>
              <Tag color="geekblue">{product.productType?.en}</Tag>

              <Divider style={{ margin: "10px 0" }} />

              <Paragraph ellipsis={{ rows: 2 }}>
                {stripTags(product.productDescription?.en)}
              </Paragraph>

              {(product.chemicalComposition ?? []).length > 0 && (
                <>
                  <Divider style={{ margin: "10px 0" }} />
                  <Text strong>🧪 Chemical Composition:</Text>
                  <ul style={{ paddingLeft: 16 }}>
                    {(product.chemicalComposition ?? []).map((chem, idx) => (
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
                    {product.mapVariant.map((variant, idx) => (
                      <li key={idx}>
                        {variant.title?.en} — ₹{variant.price}{" "}
                        {variant.compareAtPrice ? (
                          <Text delete style={{ marginLeft: 4 }}>
                            ₹{variant.compareAtPrice}
                          </Text>
                        ) : null}
                      </li>
                    ))}
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
