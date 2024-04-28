import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizSessionDto } from './create-quiz-session.dto';
import {Quiz} from "../../quizzes/entities/quiz.entity";
import {User} from "../../users/entities/user.entity";
import {players} from "../entities/players.entity";


export class UpdateQuizSessionDto extends PartialType(CreateQuizSessionDto) {
  quiz ?: Quiz;
  hasStarted?: boolean=false;
  players? : players[];

}
