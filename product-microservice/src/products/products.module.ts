import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { productSchema } from './schemas/product.schema';
import { ClientProxyShoppingCart } from 'src/proxyrmq/client-proxy-shopping-cart';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: productSchema }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ClientProxyShoppingCart],
  exports: [ProductsModule],
})
export class ProductsModule {}
