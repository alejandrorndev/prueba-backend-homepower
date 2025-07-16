import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // Importa ValidationPipe
import { AllExceptionsFilter } from './common/filters/http-exception.filter'; // Importa tu filtro de excepciones

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita el ValidationPipe globalmente
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, 
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Registra tu filtro de excepciones global.
  app.useGlobalFilters(new AllExceptionsFilter());

  // Define el puerto donde escuchará tu aplicación.
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();