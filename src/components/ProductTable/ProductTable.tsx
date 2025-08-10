"use client";
import React, { useState } from "react";
import { Product } from "@/types/product";
import Link from "next/link";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Tag,
  Divider,
  Carousel,
  Image,
  Select,
} from "antd";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const ProductTable = ({ products }: { products: Product[] }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Extract unique types
  const uniqueTypes = Array.from(
    new Set(products.map((p) => p.productType?.en).filter(Boolean))
  );

  const filteredProducts = selectedType
    ? products.filter((p) => p.productType?.en === selectedType)
    : products;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Text strong>Filter by Type:</Text>{" "}
        <Select
          allowClear
          placeholder="Select product type"
          onChange={(value) => setSelectedType(value || null)}
          style={{ width: 200 }}
        >
          {uniqueTypes.map((type) => (
            <Option key={type} value={type}>
              {type}
            </Option>
          ))}
        </Select>
      </div>

      <Row gutter={[16, 16]}>
        {filteredProducts.map((product: Product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.productId}>
            <Card
              hoverable
              cover={
                product.productImages?.length > 0 && (
                  <Carousel autoplay autoplaySpeed={5000}>
                    {product.productImages.map((img, idx) => (
                      <div key={idx}>
                        <Image
                          src={img}
                          alt={`${product.productName.mr} - ${idx + 1}`}
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
                )
              }
              actions={[
                <Link key="edit" href={`/products/${product.productId}/edit`}>
                  ✏️ Edit
                </Link>,
              ]}
            >
              <Title level={5}>{product.productName.mr}</Title>
              <Paragraph type="secondary">{product.vendor}</Paragraph>
              <Tag color="geekblue">{product.productType?.mr}</Tag>

              <Divider style={{ margin: "10px 0" }} />

              <Paragraph ellipsis={{ rows: 2 }}>
                {product.productDescription.mr}
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

              {product.mapVariant?.length > 0 && (
                <>
                  <Divider style={{ margin: "10px 0" }} />
                  <Text strong>📦 Variants:</Text>
                  <ul style={{ paddingLeft: 16 }}>
                    {product.mapVariant.map((variant, idx) => (
                      <li key={idx}>
                        {variant.title?.mr} — ₹{variant.price}{" "}
                        {variant.compareAtPrice ? (
                          <Text delete style={{ marginLeft: 4 }}>
                            ₹{variant.compareAtPrice}
                          </Text>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductTable;
