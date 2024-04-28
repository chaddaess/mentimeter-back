import { Test, TestingModule } from '@nestjs/testing';
import { UserAnswerGateway } from './user-answer.gateway';
import { UserAnswerService } from './user-answer.service';

describe('UserAnswerGateway', () => {
  let gateway: UserAnswerGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAnswerGateway, UserAnswerService],
    }).compile();

    gateway = module.get<UserAnswerGateway>(UserAnswerGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
