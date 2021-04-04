import { SharedModule } from '@app/shared';
import { Module } from '@nestjs/common';
import { AppDomainController } from './api/app-domain.controller';
import { AppDomainService } from './api/app-domain.service';

@Module({
  imports: [SharedModule],
  controllers: [AppDomainController],
  providers: [AppDomainService],
})
export class AppDomainModule {}
