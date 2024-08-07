import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: `http://localhost:3000`, // Permitir solicitudes solo desde este origen
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true, // Permitir el envío de cookies
  });

  const config = new DocumentBuilder()
    .setTitle('API 70005')
    .setDescription("Api's")
    .setVersion('1.0')
    .addTag('70005_api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(cookieParser());
  
  await app.listen(5005);
}
bootstrap();
