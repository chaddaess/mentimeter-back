import { Module } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Quiz } from "./entities/quiz.entity";
import { Question } from "../questions/entities/question.entity";
import { User } from "../users/entities/user.entity";
import {QuestionsService} from "../questions/questions.service";
import {OptionsService} from "../options/options.service";
import { Option } from "../options/entities/option.entity";
import {OptionsModule} from "../options/options.module";

@Module({
  controllers: [QuizzesController],
  providers: [QuizzesService],
  imports:[TypeOrmModule.forFeature([Quiz,Question,User,Option])]
})
export class QuizzesModule {}
