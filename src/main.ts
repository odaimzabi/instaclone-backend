import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import 'dotenv/config'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser())
  app.enableCors({credentials:true,origin:"http://localhost:3000"})
  await app.listen(4000);
}
bootstrap();
