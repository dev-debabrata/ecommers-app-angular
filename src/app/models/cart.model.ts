export interface CartItem {
  id: string;
  name: string;
  price: number;
  discount?: number;
  image: string;
  category: string;
  brand: string;
  stock: number;
  quantity: number;
  createdAt?: number;
}
