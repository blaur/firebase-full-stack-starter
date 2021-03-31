import { Controller, Get } from '@nestjs/common';
import { MyAppDomainService } from './my-app-domain.service';

@Controller()
export class MyAppDomainController {
  constructor(private readonly myAppDomainService: MyAppDomainService) {}

  @Get()
  getHello(): string {
    return this.myAppDomainService.getHello();
  }
}
