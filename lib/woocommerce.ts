const WC_URL = process.env.WOOCOMMERCE_API_URL!;
const WC_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY!;
const WC_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET!;

const authHeader = 'Basic ' + Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');

export interface WCLineItem {
  product_id: number;
  quantity: number;
}

export interface WCAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email: string;
  phone: string;
}

export interface WCShippingLine {
  method_id: string;
  method_title: string;
  total: string;
}

export interface WCOrderData {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: WCAddress;
  shipping: Omit<WCAddress, 'email' | 'phone'>;
  line_items: WCLineItem[];
  shipping_lines?: WCShippingLine[];
  customer_note?: string;
}

export async function createWooOrder(orderData: WCOrderData) {
  const response = await fetch(`${WC_URL}/orders`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
      'User-Agent': 'Revival Peptides Site/1.0',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`WooCommerce API error ${response.status}: ${errorText}`);
  }

  return response.json();
}

export async function getProduct(productId: number) {
  const response = await fetch(`${WC_URL}/products/${productId}`, {
    headers: {
      'Authorization': authHeader,
      'User-Agent': 'Revival Peptides Site/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch product ${productId}`);
  }

  return response.json();
}

export async function testConnection() {
  try {
    const response = await fetch(`${WC_URL}/products?per_page=1`, {
      headers: {
        'Authorization': authHeader,
        'User-Agent': 'Revival Peptides Site/1.0',
      },
    });
    return {
      ok: response.ok,
      status: response.status,
      body: response.ok ? 'Connected' : await response.text(),
    };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return { ok: false, status: 0, body: msg };
  }
}
