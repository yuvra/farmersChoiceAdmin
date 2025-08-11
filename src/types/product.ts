export interface Product {
  productId?: string; 
  isOutOfStock?: boolean;    
  position: number;
  showProduct: boolean;
  productName: { mr: string; en: string; hi: string };
  productDescription: { mr: string; en: string; hi: string };
  productType: { mr: string; en: string; hi: string };
  chemicalComposition?: string[];
  vendor: string;
  productImages: string[];
  mapVariant: Array<{
    title: { mr: string; en: string; hi: string };
    price: number;
    compareAtPrice: number;
    inventoryQuantity: number;
    showVariant?: boolean; 
  }>;
}
