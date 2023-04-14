import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap, timeout } from 'rxjs';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  private logger = new Logger(TimeoutInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status = response.statusCode;

    const now = Date.now();
    return next.handle().pipe(
      timeout(10000),
      tap(() =>
        this.logger.log(
          `${request.method} ${request.url} ${status} ${Date.now() - now}ms`,
        ),
      ),
    );
  }
}
