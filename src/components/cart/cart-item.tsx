import { CartItem } from '@/lib/types';

export default function CartItemComponent({ item }: { item: CartItem }) {
  return (
    <div>
      <h3>{item.name}</h3>
      <p>Variant: {item.variant_id}</p>
      <p>Price: ${item.price}</p>
      <p>Quantity: {item.quantity}</p>
      {item.customizations.text && <p>Custom Text: {item.customizations.text}</p>}
      {item.customizations.image && <img src={item.customizations.image} alt="Custom Image" />}
    </div>
  );
}