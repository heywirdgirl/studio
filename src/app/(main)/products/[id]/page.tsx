'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart } from 'lucide-react';

async function getProductById(id: number): Promise<Product | null> {
  const apiKey = process.env.NEXT_PUBLIC_PRINTFUL_API_TOKEN;
  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_PRINTFUL_API_TOKEN is not defined in environment variables.");
  }
    
  const response = await fetch(`https://api.printful.com/sync/products/${id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    next: { revalidate: 3600 } // Revalidate every hour
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

export default function ProductPage({ params }: { params: { id: string } }) {
  const productId = parseInt(params.id, 10);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { dispatch } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isNaN(productId)) {
      notFound();
    }

    const fetchProduct = async () => {
      try {
        const fetchedProduct = await getProductById(productId);
        if (!fetchedProduct) {
          notFound();
        }
        setProduct(fetchedProduct);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      dispatch({
        type: 'ADD_ITEM',
        payload: { product, quantity: 1 }
      });
      toast({
        title: 'Added to Cart',
        description: `${product.name} has been added to your cart.`,
      });
      router.push('/cart');
    }
  };

  if (loading) {
    return (
        <div className="container py-8">
            <div className="grid md:grid-cols-2 gap-8">
                <Skeleton className="w-full aspect-square" />
                <div className="space-y-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-12 w-1/2" />
                </div>
            </div>
        </div>
    )
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
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
                <div className="aspect-square relative">
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-bold tracking-tight font-headline">{product.name}</h1>
                <p className="text-2xl font-semibold text-primary">${product.price.toFixed(2)}</p>
            </div>
          <p className="text-muted-foreground">{product.description}</p>
          
          <Button onClick={handleAddToCart} size="lg" className="w-full md:w-auto">
            <ShoppingCart className="mr-2"/>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
