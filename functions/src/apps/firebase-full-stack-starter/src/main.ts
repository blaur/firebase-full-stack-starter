import { NestFactory } from '@nestjs/core';
import { AppDomainModule } from './app-domain.module';

async function bootstrap() {
  const app = await NestFactory.create(AppDomainModule);
  await app.listen(3000);
}
bootstrap();
