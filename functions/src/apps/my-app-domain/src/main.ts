import { NestFactory } from '@nestjs/core';
import { MyAppDomainModule } from './my-app-domain.module';

async function bootstrap() {
  const app = await NestFactory.create(MyAppDomainModule);
  await app.listen(3000);
}
bootstrap();
