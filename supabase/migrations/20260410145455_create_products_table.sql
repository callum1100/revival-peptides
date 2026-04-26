/*
  # Create Products Table for Revival Peptides

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text) - Product display name
      - `slug` (text, unique) - URL-friendly identifier
      - `category` (text) - Product category (Peptides, Serums)
      - `price` (numeric) - Base price
      - `price_max` (numeric, nullable) - Max price for variable products
      - `description` (text) - Full scientific description
      - `short_description` (text) - Brief description for cards
      - `highlights` (text[]) - Bullet point highlights array
      - `dosage` (text) - Default dosage/size (e.g., "10mg")
      - `dosage_options` (text[]) - Available dosage options
      - `image_url` (text) - Primary product image URL
      - `badge_text` (text) - Badge like "99.9% Pure"
      - `is_featured` (boolean) - Whether shown in featured section
      - `is_new_arrival` (boolean) - New arrival flag
      - `stock_status` (text) - in_stock, out_of_stock, on_backorder
      - `related_product_slugs` (text[]) - Slugs of related products
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `products` table
    - Add policy for public read access (products are public catalog items)

  3. Notes
    - Products are public-facing catalog items visible to all visitors
    - No write access needed from client side (admin only via service role)
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL DEFAULT 'Peptides',
  price numeric(10,2) NOT NULL,
  price_max numeric(10,2),
  description text NOT NULL DEFAULT '',
  short_description text NOT NULL DEFAULT '',
  highlights text[] DEFAULT ARRAY[]::text[],
  dosage text NOT NULL DEFAULT '10mg',
  dosage_options text[] DEFAULT ARRAY['10mg']::text[],
  image_url text NOT NULL DEFAULT '',
  badge_text text DEFAULT '99.9% Pure',
  is_featured boolean DEFAULT false,
  is_new_arrival boolean DEFAULT false,
  stock_status text DEFAULT 'in_stock',
  related_product_slugs text[] DEFAULT ARRAY[]::text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);
