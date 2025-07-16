import { Catch, ArgumentsHost, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Si es una HttpException (ej. NotFoundException, BadRequestException), usa su estado.
    // De lo contrario, asume un error interno del servidor code 500.
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;


    let errorMessage =
      exception instanceof HttpException
        ? (exception.getResponse() as any).message || exception.message
        : 'Error interno del servidor';

    if (status === HttpStatus.BAD_REQUEST && (exception as any).response && Array.isArray((exception as any).response.message)) {
      errorMessage = (exception as any).response.message.join(', ');
    }
    else if (status === HttpStatus.BAD_REQUEST && (exception as any).response && typeof (exception as any).response.message === 'string') {
      errorMessage = (exception as any).response.message;
    }


    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: errorMessage,
      // Puedes añadir más detalles para depuración
    };
    response.status(status).json(errorResponse);
  }
}