import { getProducts } from '@/lib/printful-api';
import ProductCard from '@/components/products/product-card';

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div>
      <h1>Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product: any) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            image={product.thumbnail}
          />
        ))}
      </div>
    </div>
  );
}