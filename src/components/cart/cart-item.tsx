'use client';

import Image from 'next/image';
import type { CartItem as CartItemType } from '@/lib/types';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { dispatch } = useCart();

  const handleQuantityChange = (quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId: item.id, quantity } });
  };

  const handleRemoveItem = () => {
    dispatch({ type: 'REMOVE_ITEM', payload: { itemId: item.id } });
  };

  return (
    <div className="flex items-start space-x-4 py-4">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
        <Image
          src={item.product.imageUrl}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <Link href={`/products/${item.product.id}`} className="font-semibold hover:underline">
          {item.product.name}
        </Link>
        <p className="text-muted-foreground text-sm">${item.product.price.toFixed(2)} each</p>
        <div className="flex items-center space-x-2 mt-2">
          <Input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
            className="h-9 w-16"
            aria-label="Quantity"
          />
        </div>
      </div>
      <div className="flex flex-col items-end justify-between h-full">
         <p className="font-bold text-lg">${(item.product.price * item.quantity).toFixed(2)}</p>
         <Button variant="ghost" size="icon" onClick={handleRemoveItem} aria-label="Remove item">
           <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
         </Button>
      </div>
    </div>
  );
}
