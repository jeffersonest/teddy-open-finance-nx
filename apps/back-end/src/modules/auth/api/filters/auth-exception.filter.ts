import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  UnauthorizedException,
} from '@nestjs/common';
import { EmailAlreadyExistsError } from '../../../users/domain/errors/email-already-exists.error.js';
import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error.js';

@Catch(InvalidCredentialsError, EmailAlreadyExistsError)
export class AuthExceptionFilter implements ExceptionFilter {
  catch(
    exception: InvalidCredentialsError | EmailAlreadyExistsError,
    host: ArgumentsHost,
  ): void {
    const response = host.switchToHttp().getResponse();
    const httpException =
      exception instanceof EmailAlreadyExistsError
        ? new ConflictException(exception.message)
        : new UnauthorizedException(exception.message);

    response.status(httpException.getStatus()).json({
      statusCode: httpException.getStatus(),
      message: exception.message,
      error: httpException.name,
      timestamp: new Date().toISOString(),
    });
  }
}
