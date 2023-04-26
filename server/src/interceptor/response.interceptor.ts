import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import { ResponseDataType } from 'src/enum/response-data-type.enum';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data) => {
        const responseData: Record<string, any> = {
          code: 0,
          msg: 'ok',
          err: null,
          type: data.type,
        };
        switch (data.type) {
          case ResponseDataType.PAGINATION:
            responseData.data = data.data;
            responseData.total = data.total;
            break;
          case ResponseDataType.BUFFER:
            response.end(data.data, 'binary');
            return;
          default:
            responseData.data = data;
        }
        return responseData;
      }),
    );
  }
}
