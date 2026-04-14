export interface CartItem {
  id: number;
  name: string;
  price: number;
  discountPercentage?: number;
  quantity: number;

  image: string;
  category: string;
  stock: number;
}
