import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message: any = exception.getResponse();

    if (typeof message.message === 'object') {
      response.status(status).json({
        statusCode: status,
        message: message.message[0],
      });
    } else if (typeof message.message === 'string') {
      response.status(status).json({
        statusCode: status,
        message: message.message,
      });
    } else {
      response.status(status).json({
        statusCode: status,
        message: 'Something went wrong',
      });
    }
  }
}
