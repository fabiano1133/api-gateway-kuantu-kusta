import { Module } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartController } from './shopping-cart.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ShoppingCartProvider } from './shopping-cart.provider';

@Module({
  imports: [DatabaseModule],
  providers: [ShoppingCartService, ...ShoppingCartProvider],
  controllers: [ShoppingCartController],
})
export class ShoppingCartModule {}
