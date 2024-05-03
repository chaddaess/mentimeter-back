import { Injectable } from '@nestjs/common';
import { Quiz } from './entities/quiz.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../common/service/crud.service';
import {CreateQuizDto} from "./dto/create-quiz.dto";
import {QuestionsService} from "../questions/questions.service";

@Injectable()
export class QuizzesService extends CrudService<Quiz>{
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
    private questionsService : QuestionsService
  ) {
      super(quizRepository);
  }
    create(createQuizDto: CreateQuizDto ): Promise<Quiz> {
        const quiz: Quiz = new Quiz();
        quiz.name = createQuizDto.name;
        quiz.user = createQuizDto.user;
        quiz.questions = createQuizDto.questions;
        quiz.topic = createQuizDto.topic;
        this.questionsService.add(quiz.questions)
        return this.quizRepository.save(quiz);

    }
}
