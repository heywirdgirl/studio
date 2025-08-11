'use client';

import { useCart } from '@/hooks/use-cart';
import CartItem from '@/components/cart/cart-item';
import CartSummary from '@/components/cart/cart-summary';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import React from 'react';

export default function CartPage() {
  const { state } = useCart();
  const { items } = state;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold font-headline mb-8">Your Cart</h1>
      {items.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 text-xl font-semibold">Your cart is empty</h2>
          <p className="mt-2 text-muted-foreground">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Button asChild className="mt-6">
            <Link href="/">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8 items-start">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-4">
                {items.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <CartItem item={item} />
                    {index < items.length - 1 && <Separator />}
                  </React.Fragment>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-1 space-y-4">
            <CartSummary />
            <Button asChild size="lg" className="w-full">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}