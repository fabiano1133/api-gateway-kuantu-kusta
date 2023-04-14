import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './interfaces/product.interface';
import { RpcException } from '@nestjs/microservices';
import { ClientProxyShoppingCart } from 'src/proxyrmq/client-proxy-shopping-cart';

@Injectable()
export class ProductsService {
  private logger = new Logger(ProductsService.name);

  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    private readonly clientProxyShoppingCart: ClientProxyShoppingCart,
  ) {}

  private shoppingCart =
    this.clientProxyShoppingCart.getClientProxyInstanceShoppingCart();

  async create(product: Product): Promise<Product> {
    try {
      const newProduct = await this.productModel.create(product);

      return newProduct.save();
    } catch (error) {
      this.logger.error(`Error creating product: ${error.message}`);
      throw new RpcException(`Error creating product: ${error.message}`);
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      return await this.productModel.find().exec();
    } catch (error) {
      this.logger.error(`Error finding products: ${error.message}`);
      throw new RpcException(`Error finding products: ${error.message}`);
    }
  }

  async addProductToCart(id: string, _id: string, quantity: any): Promise<any> {
    try {
      const product = await this.productModel.findOne({ _id }).exec();

      const cart = await this.shoppingCart.send('get-cart', id).toPromise();

      const convertQuantity = () => {
        for (const q in quantity) {
          return parseInt(quantity[q]);
        }
      };

      const productToAdd = {
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity: convertQuantity(),
      };

      const newCart = Object.assign(cart, {
        totalPrice: cart.totalPrice + product.price * convertQuantity(),
        totalQuantity: [...cart.products, productToAdd].length,
        products: [...cart.products, productToAdd],
      });

      const cartUpdated = await this.shoppingCart
        .emit('update-cart', { newCart })
        .toPromise();
      console.log(cartUpdated);

      return cartUpdated;
    } catch (error) {
      this.logger.error(`Error adding product to cart: ${error.message}`);
      throw new RpcException(`Error adding product to cart: ${error.message}`);
    }
  }
}
