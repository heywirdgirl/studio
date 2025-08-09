'use client';

import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartButton() {
  const { totalItems } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Button variant="ghost" size="icon" asChild>
      <Link href="/cart" className="relative">
        <ShoppingCart />
        {isClient && totalItems > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full flex items-center justify-center text-xs"
          >
            {totalItems}
          </Badge>
        )}
        <span className="sr-only">Shopping Cart</span>
      </Link>
    </Button>
  );
}
