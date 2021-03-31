import { Controller, Get } from '@nestjs/common';
import { AppDomainService } from './app-domain.service';

@Controller()
export class AppDomainController {
  constructor(private readonly appDomainService: AppDomainService) {}

  @Get()
  getHello(): string {
    return this.appDomainService.getHello();
  }

  hey() {
    return null;
  }
}
