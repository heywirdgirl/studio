'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Brush, User, LogIn, LogOut } from 'lucide-react';
import CartButton from '@/components/cart/cart-button';

export default function Header() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Brush className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block text-lg">CustomPrint</span>
        </Link>
        <nav className="flex-1">
          {/* Add more nav links here if needed */}
        </nav>
        <div className="flex items-center space-x-2">
          <CartButton />
          {loading ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
          ) : user ? (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/account">
                  <User />
                  <span className="sr-only">Account</span>
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut />
                <span className="sr-only">Sign Out</span>
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
