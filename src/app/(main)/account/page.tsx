'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading || !user) {
    return (
        <div className="container py-8">
            <Skeleton className="h-10 w-1/3 mb-4"/>
            <Skeleton className="h-8 w-1/2 mb-8"/>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/4"/>
                    <Skeleton className="h-4 w-1/2"/>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-32"/>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold font-headline mb-2">My Account</h1>
      <p className="text-muted-foreground mb-8">Manage your account settings and view your orders.</p>
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium">Email</p>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
           <div>
            <p className="font-medium">User ID</p>
            <p className="text-muted-foreground text-sm">{user.uid}</p>
          </div>
          <Button variant="destructive" onClick={handleSignOut}>
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
