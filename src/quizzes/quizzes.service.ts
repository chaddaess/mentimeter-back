import { Injectable } from '@nestjs/common';
import { Quiz } from './entities/quiz.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../common/service/crud.service';

@Injectable()
export class QuizzesService extends CrudService<Quiz>{
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
  ) {
      super(quizRepository);
  }

    joinQuiz(quizCode: string, playerId: string, playerName: string): boolean {
        const quiz = this.findOne(quizCode);
        if (quiz && !quiz.started) {
            quiz.players.push({ playerId, playerName, score: 0 });
            return true;
        }
        return false;
    }

    startQuiz(quizCode: string): any[] {
        const quiz = this.quizzes.get(quizCode);
        if (quiz) {
            quiz.started = true;
            return quiz.questions; // Send the questions to all players
        }
        return [];
    }
}
