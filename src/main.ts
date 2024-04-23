import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from "dotenv"
import * as process from "process";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from "@nestjs/common";
import { AuthenticationModule } from "./authentication/authentication.module";
import { WsAdapter } from '@nestjs/platform-ws';
dotenv.config();
dotenv.config()
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Mentimeter API')
    .setDescription('This API provides all the functionalities of the quiz app ')
    .setVersion('1.0')
    .addTag('authentication')
    .build();
  const document = SwaggerModule.createDocument(app,config, {
    include: [AuthenticationModule],
  });
  SwaggerModule.setup('document', app, document);
  app.useGlobalPipes(new ValidationPipe())
  app.useWebSocketAdapter(new WsAdapter(app));
  await app.listen(process.env.APP_PORT);
}
bootstrap();
