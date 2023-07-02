import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {SwaggerModule,DocumentBuilder} from '@nestjs/swagger'
import * as cookieParser from "cookie-parser"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin:'http://localhost:8000',
    credentials:true
  })

  const config= new DocumentBuilder()
      .addBearerAuth()
      .setTitle(`70005 api's concurse`)
      .setDescription(`api's para usar en plataforma de concursos 70005. @all right reserveds`)
      .setVersion('0.1')
      .addTag('70005 api')
      .build()
  const document = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api',app,document);

  app.use(cookieParser())
  await app.listen(8000);

}
bootstrap();
