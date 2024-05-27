import { PartialType } from '@nestjs/mapped-types';
import { CreateUserAnswerDto } from './create-user-answer.dto';
import {User} from "../../users/entities/user.entity";
import {Option} from "../../options/entities/option.entity";
import {Quiz} from "../../quizzes/entities/quiz.entity";

export class UpdateUserAnswerDto extends PartialType(CreateUserAnswerDto) {
  id: string;

  user: User;

  answer: Option;

  quiz: Quiz;
}
