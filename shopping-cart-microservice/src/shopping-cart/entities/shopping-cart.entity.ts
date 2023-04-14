import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ShoppingCart {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  userId?: string;

  @Column()
  totalPrice: number;

  @Column()
  totalQuantity: number;

  @Column({ type: 'jsonb', nullable: true })
  products: Products[];
}

interface Products {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}
