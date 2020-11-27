import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  /**
   * Description: Intercepts one request to log time spent between request/response.
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    Logger.log(
      `Before... ${request.method} ${request.url}`,
      'LoggingInterceptor',
    );

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          Logger.log(
            `After... ${request.method} ${request.url} ${Date.now() - now} ms`,
            'LoggingInterceptor',
          ),
        ),
      );
  }
}
