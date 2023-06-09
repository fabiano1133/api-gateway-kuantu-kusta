import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ShoppingCart } from './entities/shopping-cart.entity';
import { RpcException } from '@nestjs/microservices';
import { UpdateCartDTO } from './DTO/update-cart.dto';
import { AnyArray } from 'mongoose';

@Injectable()
export class ShoppingCartService {
  private logger = new Logger(ShoppingCartService.name);

  constructor(
    @Inject('SHOPPING_CART_REPOSITORY')
    private shoppingCartRepository: Repository<ShoppingCart>,
  ) {}

  async create(shoppingCart: ShoppingCart): Promise<ShoppingCart> {
    try {
      const newShoppingCart = this.shoppingCartRepository.create(shoppingCart);

      return await this.shoppingCartRepository.save(newShoppingCart);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error.message);
    }
  }

  async getCart(id: string): Promise<ShoppingCart> {
    try {
      const cart = await this.shoppingCartRepository.findOne({
        where: {
          id: id,
        },
      });

      return cart;
    } catch (error) {
      this.logger.error(error.message);
      throw new RpcException(`ERROR ${error.message}`);
    }
  }

  async updateCart(id: string, updateCartDto: UpdateCartDTO): Promise<any> {
    try {
      await this.shoppingCartRepository
        .createQueryBuilder()
        .update(ShoppingCart)
        .set({
          totalPrice: updateCartDto.totalPrice,
          totalQuantity: updateCartDto.totalQuantity,
          products: updateCartDto.products,
        })
        .where('id = :id', { id: id })
        .execute();
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(`ERROR: ${error.message}`);
    }
  }
  async removeProductInCart(id: string, _id: string): Promise<void> {
    const cartFound = await this.shoppingCartRepository.findOne({
      where: {
        id,
      },
    });

    function removePorId(products: any[], _id: string) {
      const result = products.filter((productId: any) => {
        return productId._id == _id;
      });
      for (const product of result) {
        const productIndex = products.indexOf(product);
        products.splice(productIndex, 1);
      }
    }
    removePorId(cartFound.products, _id);

    await this.updateCart(id, cartFound);
  }
}
