import { Injectable } from '@nestjs/common';
import { CreateQuizSessionDto } from './dto/create-quiz-session.dto';
import { UpdateQuizSessionDto } from './dto/update-quiz-session.dto';
import { v4 as uuidv4 } from 'uuid';
import {QuizSession} from "./entities/quiz-session.entity";
import {Quiz} from "../quizzes/entities/quiz.entity";
import {User} from "../users/entities/user.entity";
import {MessageBody} from "@nestjs/websockets";

@Injectable()
export class QuizSessionService {
  private quizzes : Map<string,QuizSession>;
  createQuiz(quizDto : CreateQuizSessionDto ): string {
    const quizCode = uuidv4();
    const {quiz,owner}=quizDto;
    const quizSession : QuizSession ={quiz :quiz , quizCode:quizCode,owner:owner ,hasStarted :false,players:[]}
    this.quizzes.set(quizCode,quizSession);
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

  findAll():Map<string,QuizSession>{
    return this.quizzes;
  }
  findOne(@MessageBody() code: string) : QuizSession{
    if(!this.quizzes[code])
      return
    return
  }
}
