export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

export interface CartItem {
  id: string; // Unique ID for the cart item, maps to product.id
  product: Product;
  quantity: number;
}

// Add this to your types to avoid TypeScript errors with the PayPal script
declare global {
    interface Window {
        paypal?: any;
    }
}
