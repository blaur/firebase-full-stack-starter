import { Test, TestingModule } from '@nestjs/testing';
import { MyAppDomainController } from './my-app-domain.controller';
import { MyAppDomainService } from './my-app-domain.service';

describe('MyAppDomainController', () => {
  let myAppDomainController: MyAppDomainController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MyAppDomainController],
      providers: [MyAppDomainService],
    }).compile();

    myAppDomainController = app.get<MyAppDomainController>(
      MyAppDomainController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(myAppDomainController.getHello()).toBe('Hello World!');
    });
  });
});
