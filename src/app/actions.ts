'use server';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { createOrder } from '@/lib/printful-api';

export async function placeOrderAction({ cartItems, paymentDetails, totalAmount }: { cartItems: any[]; paymentDetails: any; totalAmount: number }) {
  // Xử lý xác minh thanh toán nếu cần
  const orderData = {
    recipient: {
      name: paymentDetails.payer.name.given_name + ' ' + paymentDetails.payer.name.surname,
      address1: paymentDetails.purchase_units[0].shipping.address.address_line_1,
      city: paymentDetails.purchase_units[0].shipping.address.admin_area_2,
      state_code: paymentDetails.purchase_units[0].shipping.address.admin_area_1,
      country_code: paymentDetails.purchase_units[0].shipping.address.country_code,
      zip: paymentDetails.purchase_units[0].shipping.address.postal_code,
    },
    items: cartItems.map(item => ({
      variant_id: item.variant_id,
      quantity: item.quantity,
      name: item.name,
      retail_price: item.price,
      files: item.customizations.image ? [{ type: 'default', url: item.customizations.image }] : [],
    })),
    external_id: paymentDetails.id,
  };

  const printfulOrder = await createOrder(/* orderData từ trước */);
  if (auth.currentUser) {
    await addDoc(collection(db, 'orders'), {
      userId: auth.currentUser.uid,
      printfulOrderId: printfulOrder.id,
      paymentDetails,
      totalAmount,
      items: cartItems,
      createdAt: new Date(),
    });
  }
  
  return printfulOrder;
}