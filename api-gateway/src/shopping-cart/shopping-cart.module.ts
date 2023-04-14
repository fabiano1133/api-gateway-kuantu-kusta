import { Module } from '@nestjs/common';
import { ShoppingCartController } from './shopping-cart.controller';
import { ClientProxyModule } from 'src/client-proxy/client-proxy.module';

@Module({
  imports: [ClientProxyModule],
  controllers: [ShoppingCartController],
})
export class ShoppingCartModule {}
