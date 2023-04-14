import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateCartDTO {
  @IsString()
  id?: string;

  @IsString()
  userId?: string;

  @ApiProperty()
  @IsNumber()
  totalPrice?: number;

  @ApiProperty()
  @IsNumber()
  totalQuantity?: number;

  @ApiProperty()
  products?: [];
}
