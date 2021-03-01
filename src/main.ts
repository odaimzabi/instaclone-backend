import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import 'dotenv/config'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser())
  
  app.enableCors({ origin: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,})
  await app.listen(process.env.PORT||4000);
}
bootstrap();
