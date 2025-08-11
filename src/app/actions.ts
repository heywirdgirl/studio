'use server';

import type { CartItem } from "./lib/types";

const BASE_URL = 'https://api-m.sandbox.paypal.com'; // Use https://api-m.paypal.com for production

const getPayPalAccessToken = async () => {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_APP_SECRET;
  
  if (!clientId || !clientSecret) {
    throw new Error('Missing PayPal credentials');
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Failed to get PayPal access token:', errorBody);
    throw new Error('Failed to get PayPal access token');
  }

  const data = await response.json();
  return data.access_token;
};


// Action for creating a PayPal order
export async function createPayPalOrderAction(total: number) {
  try {
    const accessToken = await getPayPalAccessToken();
    const url = `${BASE_URL}/v2/checkout/orders`;

    const payload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: total.toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/account`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error('Failed to create PayPal order:', errorBody);
        throw new Error('Failed to create PayPal order');
    }

    const data = await response.json();

    return { success: true, orderId: data.id };
  } catch(error) {
    console.error(error);
    return { success: false, message: 'Failed to create PayPal order.' };
  }
}

export async function capturePayPalOrderAction(orderId: string, cartItems: CartItem[], shippingInfo: any, total: number) {
    try {
        const accessToken = await getPayPalAccessToken();
        const url = `${BASE_URL}/v2/checkout/orders/${orderId}/capture`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        
        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Failed to capture PayPal order:', errorBody);
            throw new Error(`Failed to capture PayPal order: ${errorBody}`);
        }
        
        const payPalOrder = await response.json();

        if (payPalOrder.status === 'COMPLETED') {
            // Here you would create the Printful order
            // This is a complex step involving mapping cart items to Printful's API structure
            console.log('PayPal order captured successfully. Creating Printful order...');
            console.log('Shipping Info:', shippingInfo);
            console.log('Cart Items:', cartItems);
            console.log('Total:', total);

            // Mocking Printful order creation
            await new Promise(resolve => setTimeout(resolve, 1000));
            const printfulOrderId = `MOCK-PRINTFUL-${Date.now()}`;
            console.log(`Mock Printful order created: ${printfulOrderId}`);
            
            return { success: true, orderId: printfulOrderId, payPalOrder };
        } else {
             return { success: false, message: 'PayPal payment not completed.' };
        }
    } catch(error) {
        console.error(error);
        return { success: false, message: 'Failed to capture PayPal order.' };
    }
}
