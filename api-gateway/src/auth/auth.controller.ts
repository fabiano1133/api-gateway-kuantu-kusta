import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { User } from './interfaces/user.interface';
import { SigninDto } from './DTO/signin.dto';
import { firstValueFrom } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('api/v1')
export class AuthController {
  constructor(
    @Inject('AUTH_USER_SERVICE')
    private readonly clientProxyAuthService: ClientProxy,
  ) {}

  @Post('user/register')
  async register(@Body() user: User) {
    this.clientProxyAuthService.emit('create-user', user);
  }

  @Post('user/signin')
  async signin(@Body() user: SigninDto) {
    const token = await firstValueFrom(
      this.clientProxyAuthService.send('sign-in', user),
    );

    return token;
  }
}
