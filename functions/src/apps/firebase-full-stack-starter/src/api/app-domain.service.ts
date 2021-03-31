import { Injectable } from '@nestjs/common';

@Injectable()
export class AppDomainService {
  getHello(): string {
    return 'Hello World!';
  }
}
