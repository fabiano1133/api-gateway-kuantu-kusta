import { Module } from '@nestjs/common';
import { ClientProxyShoppingCart } from './client-proxy-shopping-cart';

@Module({
  providers: [ClientProxyShoppingCart],
  exports: [ClientProxyShoppingCart],
})
export class ProxyrmqModule {}
