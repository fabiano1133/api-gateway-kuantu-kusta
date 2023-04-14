import { Controller, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private logger = new Logger(AuthController.name);

  @MessagePattern('sign-in')
  async signIn(@Payload() data: any, @Ctx() context: RmqContext): Promise<any> {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      const { email, password } = data;

      const user = await this.authService.signIn(email, password);

      this.logger.log(`${JSON.stringify(email)} signed in`);

      await channel.ack(originalMsg);

      return user;
    } catch (error) {
      this.logger.error(error.message);
      await channel.ack(originalMsg);
    }
  }
}
