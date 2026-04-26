/*
  # Add WooCommerce Product ID Mappings

  1. Changes
    - Ensures `wc_product_id` column exists on products table
    - Maps all known Revival Peptides products to their WooCommerce product IDs
    - Adds `is_variable_product` flag for GLP products that need redirect to product page

  2. Notes
    - Products without a wc_product_id will be skipped gracefully at checkout
    - Variable products (GLP-2T, GLP-3R) cannot be directly added to WooCommerce cart
*/

ALTER TABLE products ADD COLUMN IF NOT EXISTS wc_product_id integer;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_variable_product boolean DEFAULT false;

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

UPDATE products SET is_variable_product = true WHERE slug IN ('glp-2t', 'glp-3r');
