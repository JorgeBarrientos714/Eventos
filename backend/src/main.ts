import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Permitir carga de imágenes base64 más grandes (por defecto Express limita a 100kb)
  app.use(json({ limit: '20mb' }));
  app.use(urlencoded({ extended: true, limit: '20mb' }));

  // Habilitar CORS para permitir peticiones desde el frontend
  app.enableCors({
    origin: true, // Reflejar el origen de la petición
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Habilitar transformación de datos
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Habilita la transformación automática
    transformOptions: {
      enableImplicitConversion: true, // Convierte tipos automáticamente
    },
  }));

  const port = process.env.PORT;

  if (!port) {
    throw new Error(
      'La variable de entorno PORT no está definida. ' +
      'Por favor, configúrala en tu archivo .env'
    );
  }

  await app.listen(port);
  console.log(`🚀 Backend corriendo en http://localhost:${port}`);
}
bootstrap();
