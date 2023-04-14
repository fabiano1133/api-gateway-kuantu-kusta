import { Controller, Logger } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { ShoppingCart } from './entities/shopping-cart.entity';
import { UpdateCartDTO } from './DTO/update-cart.dto';

@Controller()
export class ShoppingCartController {
  logger: Logger = new Logger(ShoppingCartController.name);

  constructor(private readonly shoppingCartService: ShoppingCartService) {}

  @EventPattern('create-cart')
  async create(
    @Payload() shoppingCart: ShoppingCart,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.shoppingCartService.create(shoppingCart);

      await channel.ack(originalMessage);

      this.logger.log(JSON.stringify(shoppingCart));
    } catch (error) {
      this.logger.error(`Error: ${error.message}`);
      await channel.ack(originalMessage);
    }
  }

  @MessagePattern('get-cart')
  async getCart(@Payload() id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    try {
      const cart = await this.shoppingCartService.getCart(id);

      await channel.ack(originalMessage);

      this.logger.log(JSON.stringify(cart));

      return cart;
    } catch (error) {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern('update-cart')
  async updateCart(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const id = data.newCart.id;
      const updateCart: UpdateCartDTO = data.newCart;

      await this.shoppingCartService.updateCart(id, updateCart);

      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(error);
      await channel.ack(originalMessage);
    }
  }
}
