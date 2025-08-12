export interface Product {
  id: string;
  name: string;
  thumbnail?: string;
  description?: string;
  variants?: Variant[];
}

export interface Variant {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  variant_id: string;
  name: string;
  price: number;
  quantity: number;
  customizations: { text?: string; image?: string };
}

export interface OrderData {
  recipient: {
    name: string;
    address1: string;
    city: string;
    state_code?: string;
    country_code: string;
    zip: string;
  };
  items: Array<{
    variant_id: string;
    quantity: number;
    name: string;
    retail_price: number;
    files?: Array<{ type: string; url: string }>;
  }>;
  external_id?: string;
}