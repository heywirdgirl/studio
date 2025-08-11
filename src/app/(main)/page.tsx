import ProductCard from '@/components/products/product-card';
import type { Product } from '@/lib/types';

async function getProducts(): Promise<Product[]> {
  const response = await fetch('https://api.printful.com/sync/products', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
      'Content-Type': 'application/json'
    },
    next: { revalidate: 3600 } // Revalidate every hour
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Map Printful API response to our Product type
  return data.result.map((item: any) => ({
    id: item.id,
    name: item.name,
    price: parseFloat(item.variants[0]?.retail_price || '0.0'),
    imageUrl: item.thumbnail_url,
    description: `A high-quality ${item.name}.`, // Printful API doesn't have a dedicated description field in the list view
  }));
}


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
