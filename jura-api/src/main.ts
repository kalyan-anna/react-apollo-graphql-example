import { AppModule } from './app.module';
import { DelayMiddleware } from './middlewares/delay.middleware';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(new DelayMiddleware().use);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
