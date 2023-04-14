import { Injectable, Logger } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,

    private jwtService: JwtService,
  ) {}

  logger = new Logger(AuthService.name);

  async signIn(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new RpcException('User or password invalid');

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new RpcException('User or password invalid');

    const payload = {
      email: user.email,
      sub: user._id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
