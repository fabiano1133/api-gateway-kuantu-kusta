import { ApiProperty } from '@nestjs/swagger';

export class SigninDto {
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
