import { PartialType } from '@nestjs/mapped-types';
import { CreateQuizSessionDto } from './create-quiz-session.dto';

export class UpdateQuizSessionDto extends PartialType(CreateQuizSessionDto) {
  id: number;
}
