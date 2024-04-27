import { Module } from '@nestjs/common';
import { UserAnswerService } from './user-answer.service';
import { UserAnswerGateway } from './user-answer.gateway';
import {Repository} from "typeorm";
import {UserAnswer} from "./entities/user-answer.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Question} from "../questions/entities/question.entity";
import {Quiz} from "../quizzes/entities/quiz.entity";
import {Option} from "../options/entities/option.entity";
import {User} from "../users/entities/user.entity";

@Module({
  providers: [UserAnswerService,UserAnswerGateway],
  imports:[TypeOrmModule.forFeature([UserAnswer])]
})
export class UserAnswerModule {}
