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
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxyService } from 'src/client-proxy/client-proxy.service';
import { CreateCartDTO } from './DTO/create-cart.dto';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('ShoppingCart')
@Controller('api/v1')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class ShoppingCartController {
  private logger = new Logger(ShoppingCartController.name);

  constructor(
    @Inject('SHOPPING_CART_SERVICE')
    private shoppingCartProxyService: ClientProxyService,
  ) {}

  @Post('create-cart')
  @UseGuards(AuthGuard)
  @ApiOperation({
    description:
      'Endpoit que cria um novo carrinho de compras vazio para o usuário logado',
    summary: 'Cria um novo carrinho de compras',
  })
  async create(
    @Body() createCartDTO: CreateCartDTO,
    @Req() req: any,
  ): Promise<void> {
    try {
      this.logger.log(`shoppingCart: ${JSON.stringify(createCartDTO)}`);
      const newCart = {
        userId: req.user.sub,
        totalPrice: createCartDTO.totalPrice,
        totalQuantity: createCartDTO.totalQuantity,
        products: createCartDTO.products,
      };
      this.shoppingCartProxyService.emit('create-cart', newCart);
    } catch (error) {
      this.logger.error(error);
    }
  }

  @Get('getcart/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    description: 'Endpoit que recupera o carrinho de compras do usuário logado',
    summary: 'Recupera o carrinho de compras do usuário logado',
  })
  async getCart(@Param('id') id: string): Promise<any> {
    const cartFound = await firstValueFrom(
      this.shoppingCartProxyService.send('get-cart', id),
    );
    if (!cartFound)
      throw new BadRequestException('The Cart infomeded not found');

    return cartFound;
  }
}
