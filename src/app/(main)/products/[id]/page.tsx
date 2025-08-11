import { notFound } from 'next/navigation';
import type { Product } from '@/lib/types';
import ProductDetails from '@/components/products/product-details';

async function getProductById(id: number): Promise<Product | null> {
  // Use the server-side environment variable
  const apiKey = process.env.PRINTFUL_API_TOKEN;
  if (!apiKey) {
    throw new Error("PRINTFUL_API_TOKEN is not defined in environment variables.");
  }
    
  const response = await fetch(`https://api.printful.com/sync/products/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    // Using Next.js fetch caching instead of revalidate
    cache: 'force-cache',
    next: { revalidate: 3600 } 
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    const errorBody = await response.text();
    console.error(`Failed to fetch product ${id}. Status: ${response.status} ${response.statusText}. Body: ${errorBody}`);
    throw new Error(`Failed to fetch product ${id}. Printful API responded with status ${response.status}. Please check your API token.`);
  }

  const data = await response.json();
  const productData = data.result.sync_product;
  const variant = data.result.sync_variants[0];

  return {
    id: productData.id,
    name: productData.name,
    price: parseFloat(variant.retail_price),
    imageUrl: productData.thumbnail_url,
    description: `A high-quality ${productData.name}. Customize and make it your own.`,
  };
}


export default async function ProductPage({ params }: { params: { id: string } }) {
  const productId = parseInt(params.id, 10);

  if (isNaN(productId)) {
    notFound();
  }
  
  let product: Product | null = null;
  let error: string | null = null;

  try {
    product = await getProductById(productId);
  } catch (e: any) {
    error = e.message;
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center py-16 text-red-500 bg-red-500/10 rounded-lg">
          <h2 className="text-xl font-semibold">Could not load product</h2>
          <p className="mt-2 text-sm max-w-2xl mx-auto">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="container py-8">
      <ProductDetails product={product} />
    </div>
  );
}
