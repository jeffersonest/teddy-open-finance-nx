import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './infrastructure/http/filters/http-exception.filter';
import { EnvironmentVariables } from './infrastructure/config/env/env.validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  app.useLogger(app.get(Logger));
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Teddy Open Finance — Clients API')
    .setDescription('API for the Tech Lead Pleno challenge')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const configService = app.get<ConfigService<EnvironmentVariables, true>>(
    ConfigService,
  );
  const port = configService.get('PORT', { infer: true });
  await app.listen(port);
  const logger = app.get(Logger);
  logger.log(`🚀 API running on http://localhost:${port}`);
  logger.log(`📖 Swagger at http://localhost:${port}/docs`);
}

bootstrap();
