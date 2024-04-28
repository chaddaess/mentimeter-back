import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Quiz } from "./entities/quiz.entity";
import { Question } from "../questions/entities/question.entity";
import { User } from "../users/entities/user.entity";
import { QuizzGateway } from './quizz.gateway';

@Module({
  controllers: [QuizzesController],
  providers: [QuizzesService, QuizzGateway],
  imports:[TypeOrmModule.forFeature([Quiz,Question,User])]
})
export class QuizzesModule {}
