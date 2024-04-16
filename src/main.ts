import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from "dotenv"
import * as process from "process";
import { ValidationPipe } from "@nestjs/common";
import "dotenv/config"
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(process.env.APP_PORT);
}
bootstrap();
