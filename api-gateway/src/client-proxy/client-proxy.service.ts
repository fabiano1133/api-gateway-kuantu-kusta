import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ClientProxyService {
  clientProxy: ClientProxy;

  async emit(eventName: string, data: any) {
    this.clientProxy.emit(eventName, data);
  }

  send(eventName: string, data: any) {
    return this.clientProxy.send(eventName, data);
  }
}
