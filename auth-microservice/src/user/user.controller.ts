import { Controller, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { CreateUserDTO } from './DTO/create-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  private logger = new Logger(UserController.name);

  @EventPattern('create-user')
  async create(@Payload() user: CreateUserDTO, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      await this.userService.create(user);

      await channel.ack(originalMsg);

      this.logger.log(`${JSON.stringify(user.name)} created`);
    } catch (error) {
      this.logger.error(error.message);
      await channel.ack(originalMsg);
    }
  }
}
