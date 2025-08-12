import { useCart } from '@/hooks/use-cart';

export default function CartSummary() {
  const { total } = useCart();
  return (
    <div>
      <h3>Subtotal: ${total.toFixed(2)}</h3>
      <p>Shipping: $5.00 (estimated)</p>
      <h2>Total: ${(total + 5).toFixed(2)}</h2>
    </div>
  );
}