import { NextRequest, NextResponse } from 'next/server';
import { createWooOrder, WCAddress } from '@/lib/woocommerce';
import { createClient } from '@supabase/supabase-js';

function getSupabaseServer() {
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    supabaseKey
  );
}

interface CheckoutItem {
  productId: string;
  quantity: number;
}

interface CheckoutRequest {
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  shipping: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  items: CheckoutItem[];
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequest = await request.json();

    if (!body.customer?.email || !body.items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('Checkout request items:', body.items);

    const supabase = getSupabaseServer();

    const productIds = body.items.map((i) => i.productId);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price, wc_product_id')
      .in('id', productIds);

    if (productsError || !products) {
      console.error('Product lookup error:', productsError);
      return NextResponse.json({ error: 'Product lookup failed' }, { status: 500 });
    }

    console.log('Products found in DB:', products);

    // Filter to only items that have a WooCommerce product ID mapping
    const sellableItems = body.items.filter((item) => {
      const product = products.find((p) => p.id === item.productId);
      return product?.wc_product_id != null;
    });

    const skippedItems = body.items.filter((item) => {
      const product = products.find((p) => p.id === item.productId);
      return !product?.wc_product_id;
    });

    if (skippedItems.length > 0) {
      console.warn('Skipping items without WooCommerce mapping:', skippedItems.map((i) => i.productId));
    }

    if (sellableItems.length === 0) {
      return NextResponse.json({
        error: 'None of the cart items are currently available for purchase. Please contact support.',
      }, { status: 400 });
    }

    const lineItems = sellableItems.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return {
        product_id: product.wc_product_id as number,
        quantity: item.quantity,
      };
    });

    console.log('Line items being sent to WC:', lineItems);

    const subtotal = sellableItems.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);

    const shippingCost = subtotal >= 250 ? 0 : 9.99;
    const total = subtotal + shippingCost;

    const shippingLines = shippingCost > 0 ? [{
      method_id: 'flat_rate',
      method_title: 'Standard Shipping',
      total: shippingCost.toFixed(2),
    }] : [];

    const billing: WCAddress = {
      first_name: body.customer.firstName,
      last_name: body.customer.lastName,
      address_1: body.shipping.address1,
      address_2: body.shipping.address2,
      city: body.shipping.city,
      state: body.shipping.state,
      postcode: body.shipping.postcode,
      country: body.shipping.country || 'US',
      email: body.customer.email,
      phone: body.customer.phone,
    };

    const shipping: Omit<WCAddress, 'email' | 'phone'> = {
      first_name: billing.first_name,
      last_name: billing.last_name,
      address_1: billing.address_1,
      address_2: billing.address_2,
      city: billing.city,
      state: billing.state,
      postcode: billing.postcode,
      country: billing.country,
    };

    const { data: attempt } = await supabase
      .from('order_attempts')
      .insert({
        customer_email: body.customer.email,
        customer_name: `${body.customer.firstName} ${body.customer.lastName}`,
        cart_items: body.items,
        total,
        status: 'submitting',
      })
      .select()
      .maybeSingle();

    const wcOrder = await createWooOrder({
      payment_method: 'stripe',
      payment_method_title: 'Credit Card',
      set_paid: false,
      billing,
      shipping,
      line_items: lineItems,
      shipping_lines: shippingLines,
    });

    if (attempt) {
      await supabase
        .from('order_attempts')
        .update({
          woocommerce_order_id: wcOrder.id,
          woocommerce_order_number: wcOrder.number,
          payment_url: wcOrder.payment_url,
          status: 'created',
        })
        .eq('id', attempt.id);
    }

    return NextResponse.json({
      success: true,
      orderId: wcOrder.id,
      orderNumber: wcOrder.number,
      paymentUrl: wcOrder.payment_url,
    });
  } catch (error: unknown) {
    console.error('Checkout error:', error);
    const message = error instanceof Error ? error.message : 'Checkout failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
