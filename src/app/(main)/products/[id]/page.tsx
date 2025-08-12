import { getProductDetails } from '@/lib/printful-api';
import ProductCustomizer from '@/components/products/product-customizer';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductDetails(params.id);

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <ProductCustomizer productId={product.id} variants={product.variants} />
    </div>
  );
}