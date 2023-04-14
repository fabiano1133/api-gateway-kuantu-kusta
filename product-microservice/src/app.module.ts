import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsModule } from './products/products.module';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://msproductdb:msproductdb@product-microservice-db.lmlyc7o.mongodb.net/products?retryWrites=true&w=majority`,
    ),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProxyrmqModule],
})
export class AppModule {}
