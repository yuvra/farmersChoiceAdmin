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

type Props = {
  mode: "add" | "edit";
  productId?: string;
};

// 🔁 Bilingual catalog for product types
const PRODUCT_TYPES = [
  { en: "Fungicide", mr: "बुरशीनाशक" },
  { en: "Insecticides", mr: "कीटकनाशक" },
  { en: "Herbicide", mr: "तणनाशक" },
  { en: "Organic Farming", mr: "सेंद्रिय शेती" },
  { en: "Plant Growth Promoter", mr: "वाढ प्रवर्तक" },
  { en: "Nutrients (Fertilizers)", mr: "पोषक तत्त्वे (खते)" },
];

const emptyProduct: Product = {
  position: 0,
  showProduct: true,
  isOutOfStock: false,
  productName: { mr: "", en: "", hi: "" },
  productDescription: { mr: "", en: "", hi: "" },
  productType: { mr: "", en: "", hi: "" },
  vendor: "",
  productImages: [""],
  chemicalComposition: [] as string[],
  mapVariant: [] as Product["mapVariant"],
};

export default function ProductForm({ mode, productId }: Props) {
  const [form] = Form.useForm();
  const router = useRouter();

  // ---------- helpers for product type ----------
  const setTypeByIndex = (idx: number | undefined) => {
    if (idx == null) return;
    const t = PRODUCT_TYPES[idx];
    const cur = form.getFieldValue("productType") || {};
    form.setFieldsValue({ productType: { ...cur, en: t.en, mr: t.mr } });
  };

  const getSelectedTypeIndex = () => {
    const curEn: string | undefined = form.getFieldValue(["productType", "en"]);
    const curMr: string | undefined = form.getFieldValue(["productType", "mr"]);
    const i = PRODUCT_TYPES.findIndex((t) => t.en === curEn || t.mr === curMr);
    return i >= 0 ? i : undefined;
  };

  // ---------- load for edit / set defaults ----------
  useEffect(() => {
    const init = async () => {
      if (mode === "edit" && productId) {
        const data = await getProductById(productId);
        if (!data) return;

        const withDefaults: Product = {
          ...emptyProduct,
          ...data,
          showProduct: data.showProduct ?? true,
          isOutOfStock: data.isOutOfStock ?? false,
          chemicalComposition: data.chemicalComposition ?? [],
          mapVariant: (data.mapVariant ?? []).map((v: any) => ({
            ...v,
            showVariant: v?.showVariant ?? true,
            title: {
              en: v?.title?.en ?? "",
              mr: v?.title?.mr ?? "",
            },
          })),
        };
        form.setFieldsValue(withDefaults);
      } else {
        form.setFieldsValue(emptyProduct);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, productId]);

  // ---------- submit ----------
  const onFinish = async (values: Product) => {
      console.log("*** Form Values:", values);

    // Set productType from selected index
    const selectedIndex = form.getFieldValue("selectedTypeIndex");

    console.log("Selected Type Index:", PRODUCT_TYPES[selectedIndex]);

      // If a type is selected, update the productType fields
      if (selectedIndex !== undefined) {
          const selectedType = PRODUCT_TYPES[selectedIndex];
          values.productType = {
              en: selectedType.en,
              mr: selectedType.mr,
              hi: "",
          };
      }

      const payload: Product = {
          ...values,
          showProduct: !!values.showProduct,
          isOutOfStock: !!(values as any).isOutOfStock,
          chemicalComposition: values.chemicalComposition ?? [],
          mapVariant: (values.mapVariant ?? []).map((v: any) => ({
              ...v,
              showVariant: v?.showVariant ?? true,
              title: {
                  en: v?.title?.en ?? "",
                  mr: v?.title?.mr ?? "",
              },
          })),
      };

      if (mode === "add") await addProduct(payload);
      else if (mode === "edit" && productId)
          await updateProduct(productId, payload);

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
                  const parsed = JSON.parse(e.target.value || "{}");
                  const withDefaults = {
                    ...emptyProduct,
                    ...parsed,
                    mapVariant: (parsed.mapVariant ?? []).map((v: any) => ({
                      ...v,
                      showVariant: v?.showVariant ?? true,
                      title: {
                        en: v?.title?.en ?? "",
                        mr: v?.title?.mr ?? "",
                      },
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

      <Form layout="vertical" form={form} onFinish={onFinish}>
        {/* Top meta */}
        <Form.Item name="position" label="📍 Position">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="vendor" label="🏢 Vendor">
          <Input />
        </Form.Item>

        {/* Booleans */}
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

        {/* Product Type */}
        <Divider>🏷 Product Type</Divider>
        {/* <Form.Item label="Choose Type (EN — MR)">
          <Select
            showSearch
            placeholder="Select product type"
            value={getSelectedTypeIndex()}
            onChange={setTypeByIndex}
            allowClear
            options={PRODUCT_TYPES.map((t, i) => ({
              label: `${t.en} — ${t.mr}`,
              value: i,
            }))}
            filterOption={(input, option) =>
              (option?.label as string).toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item> */}

        <Form.Item
          label="Choose Type (EN — MR)"
          name="selectedTypeIndex"
          getValueProps={() => ({
            value: getSelectedTypeIndex(),
          })}
          getValueFromEvent={(value) => {
            setTypeByIndex(value);
            return value;
          }}
        >
          <Select
            showSearch
            placeholder="Select product type"
            allowClear
            options={PRODUCT_TYPES.map((t, i) => ({
              label: `${t.en} — ${t.mr}`,
              value: i,
            }))}
            filterOption={(input, option) =>
              (option?.label as string).toLowerCase().includes(input.toLowerCase())
            }
          />
        </Form.Item>


        <Divider>🌐 ENGLISH Content</Divider>
        <Form.Item name={["productName", "en"]} label="Product Name (English)">
          <Input />
        </Form.Item>
        <Form.Item name={["productDescription", "en"]} label="Description (English)">
          <Input.TextArea rows={3} />
        </Form.Item>
        {/* <Form.Item name={["productType", "en"]} label="Product Type (English)">
          <Input placeholder="e.g., Insecticide" />
        </Form.Item> */}

        <Divider>🌾 मराठी माहिती</Divider>
        <Form.Item name={["productName", "mr"]} label="उत्पादनाचे नाव (मराठी)">
          <Input />
        </Form.Item>
        <Form.Item name={["productDescription", "mr"]} label="वर्णन (मराठी)">
          <Input.TextArea rows={3} />
        </Form.Item>
        {/* <Form.Item name={["productType", "mr"]} label="उत्पादन प्रकार (मराठी)">
          <Input placeholder="उदा., कीटकनाशक" />
        </Form.Item> */}

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
                    name={[name, "title", "en"]}
                    label="Variant Title (English)"
                    rules={[{ required: true, message: "Please enter title (EN)" }]}
                  >
                    <Input placeholder="e.g., 250 ml" />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "title", "mr"]}
                    label="Variant Title (Marathi)"
                    rules={[{ required: true, message: "Please enter title (MR)" }]}
                  >
                    <Input placeholder="उदा., 250 ml" />
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
                      showVariant: true,
                      title: { en: "", mr: "" },
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
