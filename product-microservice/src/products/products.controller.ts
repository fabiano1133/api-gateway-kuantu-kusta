import { Controller, Logger, Param } from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Product } from './interfaces/product.interface';
import { ProductDTO } from './DTO/product.dto';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  logger = new Logger(ProductsController.name);

  @EventPattern('create-product')
  async create(@Payload() product: Product, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.productsService.create(product);

      await channel.ack(originalMessage);

      this.logger.log(JSON.stringify(`Product ${product.name} created!`));
    } catch (error) {
      this.logger.error(`Error creating product: ${error.message}`);

      await channel.ack(originalMessage);
    }
  }

  @MessagePattern('get-products')
  async findAll(@Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const products = await this.productsService.findAll();

      await channel.ack(originalMessage);

      this.logger.log(JSON.stringify(products));

      return products;
    } catch (error) {
      this.logger.error(`Error finding products: ${error.message}`);

      await channel.ack(originalMessage);
    }
  }

  @EventPattern('add-product-cart')
  async addProductToCart(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.productsService.addProductToCart(
        data.id,
        data._id,
        data.quantity,
      );

      await channel.ack(originalMessage);

      this.logger.log(JSON.stringify(`Product ${data._id} added to cart!`));
    } catch (error) {
      this.logger.error(`Error adding product to cart: ${error.message}`);

      await channel.ack(originalMessage);
    }
  }
}
