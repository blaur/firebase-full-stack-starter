import { Module } from '@nestjs/common';
import { MyAppDomainController } from './my-app-domain.controller';
import { MyAppDomainService } from './my-app-domain.service';

@Module({
  imports: [],
  controllers: [MyAppDomainController],
  providers: [MyAppDomainService],
})
export class MyAppDomainModule {}
