import { getProductById } from '@/lib/printful-mock-api';
import ProductCustomizer from '@/components/products/product-customizer';
import { notFound } from 'next/navigation';

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
