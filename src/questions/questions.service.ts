import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from '../common/service/crud.service';
import {OptionsService} from "../options/options.service";

@Injectable()
export class QuestionsService extends CrudService<Question>{
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    private optionsService : OptionsService
  ) {
    super(questionRepository);
  }
  public add(questions : Question[]){
    for(const question of questions){
      this.questionRepository.create(question);
      this.optionsService.add(question?.options);
    }
  }
}
