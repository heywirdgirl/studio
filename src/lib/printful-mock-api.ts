import type { Product } from './types';

const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Classic White T-Shirt',
    price: 18.99,
    imageUrl: 'https://placehold.co/600x600.png',
    description: 'A comfortable and durable 100% cotton t-shirt. The perfect canvas for your custom designs.',
  },
  {
    id: 2,
    name: 'Cozy Black Hoodie',
    price: 35.5,
    imageUrl: 'https://placehold.co/600x600.png',
    description: 'Stay warm and stylish with this premium black hoodie. Made from a soft cotton-poly blend.',
  },
  {
    id: 3,
    name: 'Ceramic Coffee Mug',
    price: 12.0,
    imageUrl: 'https://placehold.co/600x600.png',
    description: 'A classic 11oz ceramic mug. Your design will be printed with high-quality, long-lasting ink.',
  },
  {
    id: 4,
    name: 'Canvas Tote Bag',
    price: 22.75,
    imageUrl: 'https://placehold.co/600x600.png',
    description: 'An eco-friendly and spacious tote bag for daily use. Made from sturdy 100% cotton canvas.',
  },
  {
    id: 5,
    name: 'Snapback Cap',
    price: 25.0,
    imageUrl: 'https://placehold.co/600x600.png',
    description: 'A stylish snapback cap with a classic fit. Your design will be embroidered for a premium look.',
  },
  {
    id: 6,
    name: 'iPhone Case',
    price: 16.5,
    imageUrl: 'https://placehold.co/600x600.png',
    description: 'A durable and slim-fitting case to protect your phone while showcasing your unique design.',
  },
];

export const getProducts = async (): Promise<Product[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockProducts;
};

export const getProductById = async (id: number): Promise<Product | undefined> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockProducts.find((p) => p.id === id);
};
