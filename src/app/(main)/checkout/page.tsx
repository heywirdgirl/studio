'use client';
import { useCart } from '@/hooks/use-cart';
import PayPalButton from '@/components/paypal/paypal-button';
import { placeOrderAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

export default function CheckoutPage() {
  const { items, total } = useCart();
  const { toast } = useToast();

  const handlePayPalSuccess = async (details: any) => {
    try {
      await placeOrderAction({
        cartItems: items,
        paymentDetails: details,
        totalAmount: total,
      });
      toast({ title: 'Order Placed Successfully!' });
      // Xóa giỏ hàng sau khi thành công
    } catch (error) {
      toast({ title: 'Error Placing Order', variant: 'destructive' });
    }
  };

  const handlePayPalError = (error: any) => {
    toast({ title: 'Payment Error', description: error.message, variant: 'destructive' });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      {/* Hiển thị tóm tắt giỏ hàng */}
      <div>Total: ${total.toFixed(2)}</div>
      <PayPalButton amount={total} onSuccess={handlePayPalSuccess} onError={handlePayPalError} />
    </div>
  );
}