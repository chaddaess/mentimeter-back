import { Module } from '@nestjs/common';
import { QuizSessionService } from './quiz-session.service';
import { QuizSessionGateway } from './quiz-session.gateway';

@Module({
  providers: [QuizSessionGateway, QuizSessionService],
})
export class QuizSessionModule {}
