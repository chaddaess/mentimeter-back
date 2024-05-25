import { Injectable } from '@nestjs/common';
import { Quiz } from './entities/quiz.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../common/service/crud.service';
import {CreateQuizDto} from "./dto/create-quiz.dto";
import {QuestionsService} from "../questions/questions.service";
import {Question} from "../questions/entities/question.entity";
import {OptionsService} from "../options/options.service";
import { Option } from "../options/entities/option.entity";

@Injectable()
export class QuizzesService extends CrudService<Quiz>{
        constructor(
            @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
        @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
        @InjectRepository(Option)
    private optionsRepository: Repository<Option>
    ) {
            super(quizRepository);
        }

        async saveQuiz(createQuizDto: CreateQuizDto) {
            const quiz: Quiz = new Quiz();
            quiz.name = createQuizDto.name;
            quiz.user = createQuizDto.user;
            quiz.questions = createQuizDto.questions;
            quiz.topic = createQuizDto.topic;

            await this.addQuestions(quiz.questions); // Wait for questions and options to be added

            await this.quizRepository.save(quiz); // Save the quiz to the database
        }

        async addQuestions(questions: Question[]) {
            const savedQuestions: Question[] = await this.questionsRepository.save(questions); // Save questions in bulk

            // Prepare options for saving
            const optionsToSave: Option[] = [];
            for (const question of savedQuestions) {
                optionsToSave.push(...question.options);
            }

            await this.optionsRepository.save(optionsToSave); // Save options in bulk
        }


}
