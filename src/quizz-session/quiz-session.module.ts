import { Module } from '@nestjs/common';
import { QuizSessionService } from './quiz-session.service';
import { QuizSessionGateway } from './quiz-session.gateway';
import {QuestionsService} from "../questions/questions.service";
import {QuizzesService} from "../quizzes/quizzes.service";
import {UsersService} from "../users/users.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Quiz} from "../quizzes/entities/quiz.entity";
import {Question} from "../questions/entities/question.entity";
import {User} from "../users/entities/user.entity";
import {Option} from "../options/entities/option.entity";

@Module({
  providers: [QuizSessionGateway,QuizSessionService],
  imports:[TypeOrmModule.forFeature([Quiz,User])]
})
export class QuizSessionModule {}
