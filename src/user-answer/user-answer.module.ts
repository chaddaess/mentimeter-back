import { Module } from '@nestjs/common';
import { UserAnswerService } from './user-answer.service';
import { UserAnswerGateway } from './user-answer.gateway';

@Module({
  providers: [UserAnswerGateway, UserAnswerService],
})
export class UserAnswerModule {}
