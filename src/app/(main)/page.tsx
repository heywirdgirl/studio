import ProductCard from '@/components/products/product-card';
import { getProducts } from '@/lib/printful-mock-api';

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="container py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl font-headline">
          Bring Your Ideas to Life
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose a product, add your design, and create something uniquely yours. High-quality custom prints, made easy.
        </p>
      </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
