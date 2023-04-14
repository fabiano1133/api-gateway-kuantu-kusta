import { ApiProperty } from '@nestjs/swagger';

export class ProductDTO {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  quantity: number;
}
