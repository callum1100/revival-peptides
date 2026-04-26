export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  price_max: number | null;
  description: string;
  short_description: string;
  highlights: string[];
  dosage: string;
  dosage_options: string[];
  image_url: string;
  badge_text: string;
  is_featured: boolean;
  is_new_arrival: boolean;
  stock_status: string;
  related_product_slugs: string[];
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedDosage: string;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}
