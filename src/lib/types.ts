export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

export interface CartItem {
  id: string; // Unique ID for the cart item, e.g., `${productId}-${timestamp}`
  product: Product;
  quantity: number;
  customization: CustomizationElement[];
}

export type CustomizationElement = {
  id: string;
  type: 'image' | 'text';
  content: string; // For text, this is the text. For image, this is the data URL.
  position: { x: number; y: number };
  size: { width: number; height: number };
  rotation: number;
  scale: number;
};
