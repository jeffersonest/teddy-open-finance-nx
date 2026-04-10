import { ArgumentsHost, Catch, ExceptionFilter, NotFoundException } from '@nestjs/common';
import { ClientNotFoundError } from '../../domain/errors/client-not-found.error.js';

@Catch(ClientNotFoundError)
export class ClientExceptionFilter implements ExceptionFilter {
  catch(exception: ClientNotFoundError, host: ArgumentsHost): void {
    const httpException = new NotFoundException(exception.message);
    const response = host.switchToHttp().getResponse();
    response.status(httpException.getStatus()).json({
      statusCode: httpException.getStatus(),
      message: exception.message,
      error: 'Not Found',
      timestamp: new Date().toISOString(),
    });
  }
}
