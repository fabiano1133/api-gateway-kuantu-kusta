import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxyService } from 'src/client-proxy/client-proxy.service';
import { CreateProductDto } from './DTO/create-product.dto';
import { Observable } from 'rxjs';
import { AuthGuard } from 'src/common/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Product')
@Controller('api/v1')
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
export class ProductController {
  private logger = new Logger(ProductController.name);

  constructor(
    @Inject('PRODUCT_SERVICE') private productProxyService: ClientProxyService,
    @Inject('SHOPPING_CART_SERVICE')
    private shoppingCartProxyService: ClientProxyService,
  ) {}

  @Post('products')
  @ApiExcludeEndpoint()
  async create(@Body() createProductDto: CreateProductDto): Promise<void> {
    this.logger.log(`createProductDto: ${JSON.stringify(createProductDto)}`);
    this.productProxyService.emit('create-product', createProductDto);
  }

  @Get('products')
  @ApiOperation({
    description:
      'Endpoit que recupera todos os produtos cadastrados na base de dados',
    summary: 'Recupera todos os produtos cadastrados',
  })
  getAll(): Observable<any> {
    this.logger.log('getAll');
    return this.productProxyService.send('get-products', '');
  }

  @Get('products/cart/:id')
  @ApiExcludeEndpoint()
  async getProductsCart(@Param('id') id: string): Promise<any> {
    const cart = await this.productProxyService
      .send('product-cart', id)
      .toPromise();

    if (!cart) throw new BadRequestException('Cart not found');

    return cart;
  }

  @Post('cartid/:id/productid/:_id')
  @UseGuards(AuthGuard)
  @ApiBody({ type: Object })
  @ApiOperation({
    description:
      'Endpoit que adiciona um produto ao carrinho de compras (bodyValue = { "quantity": number} )',
    summary: 'Adiciona um produto ao carrinho de compras',
  })
  async addProductToCart(
    @Param('id') id: string,
    @Param('_id') _id: string,
    @Body() quantity: number,
  ): Promise<any> {
    const shoppingCartFound = await this.shoppingCartProxyService
      .send('get-cart', id)
      .toPromise();

    if (!shoppingCartFound) throw new BadRequestException('Cart not found');

    await this.productProxyService.emit('add-product-cart', {
      id,
      _id,
      quantity,
    });
    this.logger.log(`product: ${JSON.stringify(_id)} add to cart: ${id}`);
  }

  @Post('cartid/:id/productid/:_id/remove')
  async removeProductInCart(
    @Param('id') id: string,
    @Param('_id') _id: string,
  ): Promise<void> {
    const shoppingCartFound = await this.shoppingCartProxyService
      .send('get-cart', id)
      .toPromise();

    if (!shoppingCartFound) throw new BadRequestException('Cart not found');

    await this.shoppingCartProxyService.emit('remove-product', {
      id,
      _id,
    });
    this.logger.log(`product: ${JSON.stringify(_id)} remove to cart: ${id}`);
  }
}
