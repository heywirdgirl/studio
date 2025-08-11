'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { ShoppingCart } from 'lucide-react';

interface ProductDetailsProps {
    product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { dispatch } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  
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

  return (
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
  );
}
