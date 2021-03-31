import { Injectable } from '@nestjs/common';

@Injectable()
export class MyAppDomainService {
  getHello(): string {
    return 'Hello World!';
  }
}
