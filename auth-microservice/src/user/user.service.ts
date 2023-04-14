import { Injectable, Logger } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { CreateUserDTO } from './DTO/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async create(createUserDTO: CreateUserDTO): Promise<void> {
    try {
      const userAlreadyExists = await this.userModel
        .findOne({
          email: createUserDTO.email,
        })
        .exec();

      if (userAlreadyExists) throw new RpcException('User already exists');

      const passwordHashed = await bcrypt.hash(createUserDTO.password, 10);

      const newUser = {
        name: createUserDTO.name,
        email: createUserDTO.email,
        password: passwordHashed,
      };

      const userCreated = await this.userModel.create(newUser);

      await userCreated.save();

      this.logger.log(`User ${userCreated} created`);
    } catch (error) {
      this.logger.error(error);
      throw new RpcException(error);
    }
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel
      .findOne({
        email,
      })
      .exec();
  }
}
