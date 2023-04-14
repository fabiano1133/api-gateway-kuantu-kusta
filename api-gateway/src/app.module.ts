import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientProxyModule } from './client-proxy/client-proxy.module';
import { ClientProxyService } from './client-proxy/client-proxy.service';
import { ProductModule } from './product/product.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ClientProxyModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ProductModule,
    ShoppingCartModule,
    AuthModule,
  ],
  providers: [
    {
      provide: 'PRODUCT_SERVICE',
      useExisting: ClientProxyModule,
    },
    {
      provide: 'SHOPPING_CART_SERVICE',
      useExisting: ClientProxyModule,
    },
    {
      provide: 'AUTH_USER_SERVICE',
      useExisting: ClientProxyModule,
    },

    ClientProxyService,
  ],
  controllers: [],
})
export class AppModule {}
