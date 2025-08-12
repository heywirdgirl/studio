import { PrintfulClient } from '@printful/sdk';

// Khởi tạo Printful client với API token từ biến môi trường
const printful = new PrintfulClient({
  accessToken: process.env.PRINTFUL_API_TOKEN!,
});

// Lấy danh sách sản phẩm từ Printful
export async function getProducts() {
  try {
    const { result } = await printful.get('store/products');
    return result.map((product: any) => ({
      id: product.id,
      name: product.name,
      thumbnail: product.thumbnail_url,
      // Thêm các trường khác nếu cần
    }));
  } catch (error) {
    console.error('Error fetching products from Printful:', error);
    throw new Error('Failed to fetch products');
  }
}

// Lấy chi tiết sản phẩm theo ID
export async function getProductDetails(id: string) {
  try {
    const { result } = await printful.get(`store/products/${id}`);
    return {
      id: result.id,
      name: result.name,
      description: result.description || '',
      variants: result.sync_variants.map((variant: any) => ({
        id: variant.id,
        name: variant.name,
        price: variant.retail_price,
        image: variant.files.find((file: any) => file.type === 'preview')?.thumbnail_url,
      })),
    };
  } catch (error) {
    console.error('Error fetching product details from Printful:', error);
    throw new Error('Failed to fetch product details');
  }
}

// Tạo đơn hàng trên Printful
export async function createOrder(orderData: any) {
  try {
    const { result } = await printful.post('orders', {
      recipient: orderData.recipient,
      items: orderData.items,
      external_id: orderData.external_id, // ID đơn hàng từ hệ thống của bạn
    });
    return result;
  } catch (error) {
    console.error('Error creating order on Printful:', error);
    throw new Error('Failed to create order');
  }
}