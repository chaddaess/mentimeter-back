import { Injectable } from '@nestjs/common';
import { CreateUserAnswerDto } from './dto/create-user-answer.dto';
import { UpdateUserAnswerDto } from './dto/update-user-answer.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Quiz} from "../quizzes/entities/quiz.entity";
import {Repository} from "typeorm";
import {UserAnswer} from "./entities/user-answer.entity";
import {CrudService} from "../common/service/crud.service";

@Injectable()
export class UserAnswerService extends CrudService<UserAnswer>{
  constructor(
      @InjectRepository(UserAnswer)
      private userAnswerRepository: Repository<UserAnswer>,
  ) {
    super(userAnswerRepository);
  }


    async handleUserAnswer(data: any): Promise<void> {
        // Logique de gestion des réponses des utilisateurs
    }
}
