import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ClientProxyModule } from 'src/client-proxy/client-proxy.module';

@Module({
  imports: [ClientProxyModule],
  controllers: [ProductController],
})
export class ProductModule {}
