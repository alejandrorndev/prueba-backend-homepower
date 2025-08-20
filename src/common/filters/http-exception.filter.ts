import { Catch, ArgumentsHost, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Filtro global para manejar todas las excepciones que ocurren en el contexto HTTP.
 * 
 * Este filtro captura cualquier error lanzado en la aplicación y devuelve
 * una respuesta JSON estandarizada con detalles útiles para el cliente.
 */
@Catch() // Captura TODAS las excepciones, no sólo las HttpException
export class AllExceptionsFilter implements ExceptionFilter {
  
  /**
   * Método principal que se ejecuta cuando ocurre una excepción.
   * @param exception - El error lanzado (puede ser de cualquier tipo).
   * @param host - Provee acceso al contexto de la solicitud (HTTP, RPC, WebSocket).
   */
  catch(exception: unknown, host: ArgumentsHost) {
    
    // Cambia el contexto genérico a HTTP para poder acceder a request y response
    const ctx = host.switchToHttp();

    // Obtenemos el objeto de respuesta (Express) para enviar el error al cliente
    const response = ctx.getResponse<Response>();

    // Obtenemos el objeto de la petición para incluir detalles como URL y método
    const request = ctx.getRequest<Request>();

    /**
     * Determinamos el código de estado HTTP que se devolverá:
     * - Si es una HttpException (ej. NotFoundException, BadRequestException), usamos su estado.
     * - Si no, asumimos que es un error interno del servidor (500).
     */
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    /**
     * Determinamos el mensaje de error:
     * - Si es una HttpException, intentamos leer su mensaje interno.
     * - Si no, devolvemos un mensaje genérico.
     */
    let errorMessage =
      exception instanceof HttpException
        ? (exception.getResponse() as any).message || exception.message
        : 'Error interno del servidor';

    /**
     * Manejo especial para errores 400 (Bad Request) con class-validator:
     * - Si el mensaje es un array de errores → lo unimos en un solo string.
     * - Si el mensaje es un string → lo usamos directamente.
     */
    if (
      status === HttpStatus.BAD_REQUEST &&
      (exception as any).response &&
      Array.isArray((exception as any).response.message)
    ) {
      errorMessage = (exception as any).response.message.join(', ');
    } 
    else if (
      status === HttpStatus.BAD_REQUEST &&
      (exception as any).response &&
      typeof (exception as any).response.message === 'string'
    ) {
      errorMessage = (exception as any).response.message;
    }

    /**
     * Estructuramos la respuesta de error en un formato consistente.
     */
    const errorResponse = {
      statusCode: status,                       // Código HTTP (ej. 400, 404, 500)
      timestamp: new Date().toISOString(),      // Fecha/hora
      path: request.url,                         // Ruta solicitada
      method: request.method,                    // Método HTTP usado (GET, POST, etc.)
      message: errorMessage,                     // Descripción del error
    };

    // Finalmente enviamos la respuesta con el código HTTP correspondiente
    response.status(status).json(errorResponse);
  }
}
