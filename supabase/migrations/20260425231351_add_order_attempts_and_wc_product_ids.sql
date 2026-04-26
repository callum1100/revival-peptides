/*
  # Add order tracking and WooCommerce product mappings

  ## Summary
  This migration sets up two things:

  1. New Tables
    - `order_attempts` — tracks every checkout attempt that flows through to WooCommerce
      - `id` (uuid, primary key)
      - `customer_email` (text) — email of the customer placing the order
      - `customer_name` (text) — full name of the customer
      - `cart_items` (jsonb) — snapshot of cart items at time of order
      - `total` (numeric) — calculated order total
      - `woocommerce_order_id` (integer) — WooCommerce order ID returned after creation
      - `woocommerce_order_number` (text) — human-readable WC order number
      - `payment_url` (text) — URL where customer is redirected to pay
      - `status` (text) — lifecycle status: pending → submitting → created → paid / failed
      - `error_message` (text) — captures any error for debugging
      - `created_at` (timestamptz)

  2. Modified Tables
    - `products` — adds `wc_product_id` integer column and populates it for all known products

  ## Security
  - RLS enabled on `order_attempts`
  - Only `service_role` can access `order_attempts` (server-side API use only, never exposed to browsers)

  ## Notes
  - The `wc_product_id` updates are idempotent (uses IF NOT EXISTS for the column)
  - All product slugs must match exactly what's in the products table
*/

-- Create order_attempts table
CREATE TABLE IF NOT EXISTS order_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_email text NOT NULL,
  customer_name text,
  cart_items jsonb NOT NULL,
  total numeric(10,2) NOT NULL,
  woocommerce_order_id integer,
  woocommerce_order_number text,
  payment_url text,
  status text NOT NULL DEFAULT 'pending',
  error_message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only for select"
  ON order_attempts FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role only for insert"
  ON order_attempts FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role only for update"
  ON order_attempts FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role only for delete"
  ON order_attempts FOR DELETE
  TO service_role
  USING (true);

-- Add wc_product_id to products if not already there
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'wc_product_id'
  ) THEN
    ALTER TABLE products ADD COLUMN wc_product_id integer;
  END IF;
END $$;

-- Populate WooCommerce product IDs
UPDATE products SET wc_product_id = 349 WHERE slug = 'bpc-157-10mg';
UPDATE products SET wc_product_id = 351 WHERE slug = 'tb-500';
UPDATE products SET wc_product_id = 356 WHERE slug = 'sermorelin-5mg';
UPDATE products SET wc_product_id = 357 WHERE slug = 'pt-141-10mg';
UPDATE products SET wc_product_id = 353 WHERE slug = 'aod-9604-5mg';
UPDATE products SET wc_product_id = 352 WHERE slug = 'ghk-cu-50mg';
UPDATE products SET wc_product_id = 348 WHERE slug = 'klow-80mg';
UPDATE products SET wc_product_id = 347 WHERE slug = 'semax-10mg';
UPDATE products SET wc_product_id = 346 WHERE slug = 'selank-10mg';
UPDATE products SET wc_product_id = 345 WHERE slug = 'mots-c-10mg';
UPDATE products SET wc_product_id = 330 WHERE slug = 'nad-plus';
UPDATE products SET wc_product_id = 328 WHERE slug = 'cjc-1295-ipamorelin';
UPDATE products SET wc_product_id = 485 WHERE slug = 'bpc-157-tb500-combo';
UPDATE products SET wc_product_id = 394 WHERE slug = 'tesa-10mg';
