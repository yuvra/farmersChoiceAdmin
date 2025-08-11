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
  Switch,
} from "antd";
import { addProduct, getProductById, updateProduct } from "@/lib/productService";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";

const { Option } = Select;

type Props = {
  mode: "add" | "edit";
  productId?: string;
};

const emptyProduct: Product = {
  position: 0,
  showProduct: true,          // NEW: default true
  isOutOfStock: false,        // NEW: default false
  productName: { mr: "", en: "", hi: "" },
  productDescription: { mr: "", en: "", hi: "" },
  productType: { mr: "", en: "", hi: "" },
  vendor: "",
  productImages: [""],
  chemicalComposition: [] as string[],    // ensure array exists
  mapVariant: [] as Product["mapVariant"],           // each item may have showVariant
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
      if (!data) return;

      // Put base first, then incoming data, then defaults for missing fields,
      // and finally normalized mapVariant. No duplicate keys before the end.
      const withDefaults: Product = {
        ...emptyProduct,                // base shape
        ...data,                        // incoming values
        showProduct: data.showProduct ?? true,
        isOutOfStock: data.isOutOfStock ?? false,
        chemicalComposition: data.chemicalComposition ?? [],
        mapVariant: (data.mapVariant ?? []).map((v: any) => ({
          ...v,
          showVariant: v?.showVariant ?? true,
        })),
      };

      setProduct(withDefaults);
      form.setFieldsValue(withDefaults);
    });
  } else {
    form.setFieldsValue(emptyProduct);
  }
}, [mode, productId]);

  const onFinish = async (values: Product) => {
    // ensure arrays/booleans are shaped correctly
    const payload: Product = {
      ...values,
      showProduct: !!values.showProduct,
      isOutOfStock: !!(values as any).isOutOfStock,
      chemicalComposition: values.chemicalComposition ?? [],
      mapVariant: (values.mapVariant ?? []).map((v: any) => ({
        showVariant: v?.showVariant ?? true,
        ...v,
      })),
    };

    if (mode === "add") {
      await addProduct(payload);
    } else if (mode === "edit" && productId) {
      await updateProduct(productId, payload);
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
                  // apply same defaults for missing booleans
                  const withDefaults = {
                    ...emptyProduct,
                    ...parsed,
                    mapVariant: (parsed.mapVariant ?? []).map((v: any) => ({
                      showVariant: v?.showVariant ?? true,
                      ...v,
                    })),
                  };
                  form.setFieldsValue(withDefaults);
                } catch {
                  alert("❌ Invalid JSON format");
                }
              }}
              placeholder="Paste full product object here..."
            />
          </Form.Item>
          <Typography.Paragraph type="secondary" style={{ fontSize: 12 }}>
            ⚠️ Must match your Product structure.
          </Typography.Paragraph>
        </Card>
      )}

      <Form layout="vertical" form={form} onFinish={onFinish} initialValues={product}>
        {/* Top meta */}
        <Form.Item name="position" label="📍 Position">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="vendor" label="🏢 Vendor">
          <Input />
        </Form.Item>

        {/* NEW: Booleans */}
        <Space size="large" style={{ marginBottom: 8 }}>
          <Form.Item
            name="showProduct"
            label="Show Product"
            valuePropName="checked"
            tooltip="Controls visibility in listing"
            style={{ marginBottom: 0 }}
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="isOutOfStock"
            label="Out of Stock"
            valuePropName="checked"
            tooltip="Mark entire product as out of stock"
            style={{ marginBottom: 0 }}
          >
            <Switch />
          </Form.Item>
        </Space>

        <Divider>🌐 ENGLISH Content</Divider>

        <Form.Item name={["productName", "en"]} label="Product Name (ENGLISH)">
          <Input />
        </Form.Item>

        <Form.Item name={["productDescription", "en"]} label="Description (ENGLISH)">
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name={["productType", "en"]} label="Product Type (ENGLISH)">
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
                <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={name}
                    rules={[{ required: true, message: "Please enter image URL" }]}
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
                <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={name}
                    rules={[{ required: true, message: "Enter composition" }]}
                  >
                    <Input placeholder="e.g., Emamectin 1.5% + Fipronil 3.5% SC" />
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
                  {/* NEW: showVariant toggle */}
                  <Form.Item
                    {...restField}
                    name={[name, "showVariant"]}
                    label="Show Variant"
                    valuePropName="checked"
                    tooltip="Controls visibility of this specific variant"
                  >
                    <Switch defaultChecked />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "title", "mr"]}
                    label="Variant Title (Marathi)"
                    rules={[{ required: true, message: "Please enter title" }]}
                  >
                    <Input placeholder="e.g., 250 ml" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "price"]}
                    label="Price"
                    rules={[{ required: true, message: "Please enter price" }]}
                  >
                    <InputNumber min={0} style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item {...restField} name={[name, "compareAtPrice"]} label="Compare At Price">
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
                <Button
                  type="dashed"
                  onClick={() =>
                    add({
                      showVariant: true, // default on add
                    })
                  }
                  block
                >
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
