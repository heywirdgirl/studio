'use client';

import { useAuth } from '@/hooks/use-auth';
import { useCart } from '@/hooks/use-cart';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createPayPalOrderAction, capturePayPalOrderAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import CartSummary from '@/components/cart/cart-summary';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


const shippingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  zipCode: z.string().min(5, 'Valid ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
});

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { state: cartState, dispatch, totalPrice } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPayPalReady, setIsPayPalReady] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/checkout');
    }
    if (!authLoading && cartState.items.length === 0) {
        router.push('/cart');
    }
  }, [user, authLoading, router, cartState.items.length]);
  
  const form = useForm<z.infer<typeof shippingSchema>>({
    resolver: zodResolver(shippingSchema),
    defaultValues: { fullName: '', address: '', city: '', zipCode: '', country: '' },
  });

  const onPayPalApprove = async (orderId: string) => {
    setIsSubmitting(true);
    const captureResult = await capturePayPalOrderAction(
        orderId,
        cartState.items,
        form.getValues(),
        totalPrice
    );

    if (captureResult.success) {
        toast({
            title: 'Order Placed!',
            description: `Your order #${captureResult.orderId} has been confirmed.`,
        });
        dispatch({ type: 'CLEAR_CART' });
        router.push('/account');
    } else {
        toast({
            variant: 'destructive',
            title: 'Payment Failed',
            description: captureResult.message || 'There was a problem capturing your payment.',
        });
    }
    setIsSubmitting(false);
  };
  
  useEffect(() => {
      if(typeof window !== 'undefined' && !window.paypal) {
        const paypalScript = document.createElement('script');
        paypalScript.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`;
        paypalScript.onload = () => {
           setIsPayPalReady(true);
        };
        document.body.appendChild(paypalScript);
      } else if (typeof window !== 'undefined' && window.paypal) {
          setIsPayPalReady(true);
      }
  }, []);
  
  useEffect(() => {
    if (isPayPalReady && window.paypal) {
      const renderButtons = async () => {
          const buttonContainer = document.getElementById('paypal-button-container');
          if (buttonContainer) {
            buttonContainer.innerHTML = '';
            try {
              await window.paypal.Buttons({
                  createOrder: async (data: any, actions: any) => {
                    const shipping = totalPrice > 0 ? 5.00 : 0;
                    const tax = totalPrice * 0.08;
                    const total = totalPrice + shipping + tax;
                    
                    const result = await createPayPalOrderAction(total);
                    if(result.success && result.orderId) {
                      return result.orderId;
                    } else {
                      toast({
                        variant: 'destructive',
                        title: 'Order Failed',
                        description: result.message || 'There was a problem preparing your order.',
                      });
                      return null;
                    }
                  },
                  onApprove: async (data: any, actions: any) => {
                    await onPayPalApprove(data.orderID);
                  },
                  onError: (err: any) => {
                      toast({
                        variant: 'destructive',
                        title: 'PayPal Error',
                        description: 'An error occurred with the PayPal transaction.',
                      });
                      console.error('PayPal Buttons Error:', err);
                  }
              }).render('#paypal-button-container');
            } catch(error) {
              console.error("Failed to render PayPal buttons", error);
            }
          }
      };
      renderButtons();
    }
  }, [isPayPalReady, cartState, totalPrice]);

  
  if (authLoading || !user || cartState.items.length === 0) {
    return (
      <div className="container py-8">
        <Skeleton className="h-12 w-1/3 mb-8" />
        <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2 space-y-4">
                <Skeleton className="h-64 w-full" />
            </div>
            <div className="md:col-span-1">
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold font-headline mb-8">Checkout</h1>
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP / Postal Code</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Payment</h3>
                {!isPayPalReady && <div className="flex items-center justify-center"><Loader2 className="mr-2 h-6 w-6 animate-spin" /><span>Loading Payment Options...</span></div>}
                <div id="paypal-button-container"></div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
            <CartSummary />
        </div>
      </div>
    </div>
  );
}
