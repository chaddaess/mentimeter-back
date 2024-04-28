import { Injectable } from '@nestjs/common';
import { CreateQuizSessionDto } from './dto/create-quiz-session.dto';
import { UpdateQuizSessionDto } from './dto/update-quiz-session.dto';
import { v4 as uuidv4 } from 'uuid';
import {QuizSession} from "./entities/quiz-session.entity";
import {Quiz} from "../quizzes/entities/quiz.entity";
import {User} from "../users/entities/user.entity";

@Injectable()
export class QuizSessionService {
  private quizzes : QuizSession[]
  createQuiz(owner : User , quiz : Quiz): string {
    const quizCode = uuidv4();
    let quizSession : QuizSession ={quiz :quiz , quizCode:quizCode,owner:owner ,hasStarted :false,players:[]}
    this.quizzes.push(quizSession);
    return quizCode;
  }

  joinQuiz(quizCode: string, playerId: string, playerName: string): boolean {
    const quiz = this.quizzes.get(quizCode);
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
