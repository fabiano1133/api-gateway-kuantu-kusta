export interface ShoppingCart {
  id?: string;
  userId: string;
  totalPrice: number;
  totalQuantity: number;
  products: [];
}
