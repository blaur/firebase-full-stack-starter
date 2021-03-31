import { SharedModule } from '@app/shared';
import { Module } from '@nestjs/common';
import { AppDomainController } from './app-domain.controller';
import { AppDomainService } from './app-domain.service';

@Module({
  imports: [SharedModule],
  controllers: [AppDomainController],
  providers: [AppDomainService],
})
export class AppDomainModule {}
