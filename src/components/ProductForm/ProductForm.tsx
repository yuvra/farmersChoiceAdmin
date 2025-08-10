"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  InputNumber,
  Typography,
  Space,
  Select,
} from "antd";
import {
  addProduct,
  getProductById,
  updateProduct,
} from "@/lib/productService";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";

const { Option } = Select;

type Props = {
  mode: "add" | "edit";
  productId?: string;
};

const emptyProduct: Product = {
  position: 0,
  showProduct: true,
  productName: { mr: "", en: "", hi: "" },
  productDescription: { mr: "", en: "", hi: "" },
  productType: { mr: "", en: "", hi: "" },
  vendor: "",
  productImages: [""],
  mapVariant: [],
};

const PRODUCT_TYPES_MR = [
  "बुरशीनाशक",
  "कीटकनाशक",
  "तणनाशक",
  "सेंद्रिय शेती",
  "वाढ प्रवर्तक",
  "पोषक तत्त्वे (खते)",
];

export default function ProductForm({ mode, productId }: Props) {
  const [form] = Form.useForm();
  const [product, setProduct] = useState<Product>(emptyProduct);
  const router = useRouter();

  useEffect(() => {
    if (mode === "edit" && productId) {
      getProductById(productId).then((data) => {
        if (data) {
          setProduct(data);
          form.setFieldsValue(data);
        }
      });
    }
  }, [mode, productId]);

  const onFinish = async (values: Product) => {
    if (mode === "add") {
      await addProduct(values);
    } else if (mode === "edit" && productId) {
      await updateProduct(productId, values);
    }
    router.push("/products");
  };

  return (
    <Card
      title={mode === "add" ? "➕ Add Product" : "✏️ Edit Product"}
      style={{ maxWidth: 800, margin: "2rem auto" }}
    >
      {mode === "add" && (
        <Card type="inner" title="📋 Paste JSON Object (Optional)" style={{ marginBottom: 24 }}>
          <Form.Item label="Raw Product JSON">
            <Input.TextArea
              rows={6}
              onBlur={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  form.setFieldsValue(parsed);
                } catch (err) {
                  alert("❌ Invalid JSON format");
                }
              }}
              placeholder='Paste full product object here...'
            />
          </Form.Item>
          <Typography.Paragraph type="secondary" style={{ fontSize: 12 }}>
            ⚠️ Paste full product JSON here to prefill the form. It must match your Product structure.
          </Typography.Paragraph>
        </Card>
      )}

      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={product}
      >
        <Form.Item name="position" label="📍 Position">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="vendor" label="🏢 Vendor">
          <Input />
        </Form.Item>

        <Divider>🌐 Marathi Content</Divider>

        <Form.Item name={["productName", "mr"]} label="Product Name (Marathi)">
          <Input />
        </Form.Item>

        <Form.Item
          name={["productDescription", "mr"]}
          label="Description (Marathi)"
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name={["productType", "mr"]} label="Product Type (Marathi)">
          <Select placeholder="Select product type">
            {PRODUCT_TYPES_MR.map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Divider>🖼 Product Images</Divider>

        <Form.List name="productImages">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={name}
                    rules={[
                      { required: true, message: "Please enter image URL" },
                    ]}
                  >
                    <Input placeholder="Image URL" />
                  </Form.Item>
                  <Button danger onClick={() => remove(name)}>
                    Remove
                  </Button>
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  ➕ Add Image URL
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider>🧪 Chemical Composition</Divider>

        <Form.List name="chemicalComposition">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={name}
                    rules={[{ required: true, message: "Enter composition" }]}
                  >
                    <Input placeholder="e.g., Carbendazim 12%" />
                  </Form.Item>
                  <Button danger onClick={() => remove(name)}>
                    Remove
                  </Button>
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  ➕ Add Chemical
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Divider>📦 Variants</Divider>

        <Form.List name="mapVariant">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  type="inner"
                  title={`Variant ${name + 1}`}
                  style={{ marginBottom: 16 }}
                  extra={
                    <Button danger size="small" onClick={() => remove(name)}>
                      Remove
                    </Button>
                  }
                >
                  <Form.Item
                    {...restField}
                    name={[name, "title", "mr"]}
                    label="Variant Title (Marathi)"
                    rules={[{ required: true, message: "Please enter title" }]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "price"]}
                    label="Price"
                    rules={[{ required: true, message: "Please enter price" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "compareAtPrice"]}
                    label="Compare At Price"
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "inventoryQuantity"]}
                    label="Inventory Quantity"
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>
                </Card>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  ➕ Add Variant
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {mode === "add" ? "➕ Add Product" : "💾 Update Product"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
