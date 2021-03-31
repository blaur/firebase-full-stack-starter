import { Test, TestingModule } from '@nestjs/testing';
import { AppDomainController } from './app-domain.controller';
import { AppDomainService } from './app-domain.service';

describe('AppController', () => {
  let appController: AppDomainController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppDomainController],
      providers: [AppDomainService],
    }).compile();

    appController = app.get<AppDomainController>(AppDomainController);
  });

  describe('root', () => {
    it('should return hello world', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
