import ProductCustomizer from '@/components/products/product-customizer';
import type { Product } from '@/lib/types';
import { notFound } from 'next/navigation';

async function getProductById(id: number): Promise<Product | null> {
  const response = await fetch(`https://api.printful.com/sync/products/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.PRINTFUL_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    next: { revalidate: 3600 } // Revalidate every hour
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`Failed to fetch product ${id}: ${response.statusText}`);
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

  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight font-headline">{product.name}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{product.description}</p>
      </div>
      <ProductCustomizer product={product} />
    </div>
  );
}
