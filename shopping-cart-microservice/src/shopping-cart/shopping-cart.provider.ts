import { DataSource } from 'typeorm';
import { ShoppingCart } from './entities/shopping-cart.entity';

export const ShoppingCartProvider = [
  {
    provide: 'SHOPPING_CART_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ShoppingCart),
    inject: ['DATABASE_CONNECTION'],
  },
];
