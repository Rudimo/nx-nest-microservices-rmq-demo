import { Test, TestingModule } from '@nestjs/testing';
import { AuthCommands } from './auth.commands';

describe('AuthController', () => {
  let controller: AuthCommands;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthCommands],
    }).compile();

    controller = module.get<AuthCommands>(AuthCommands);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
