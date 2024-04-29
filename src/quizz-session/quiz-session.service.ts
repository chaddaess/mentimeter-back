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
  quizzes : Map<any,any> =new Map();
  createQuiz(quizDto: CreateQuizSessionDto): string {
    console.log("please please please");
    const quizCode = uuidv4();
    const {quiz,owner}=quizDto;
    const quizSession : QuizSession ={quiz :quiz , quizCode:quizCode,owner:owner ,hasStarted :false,players:[]}
    this.quizzes.set(quizCode,quizSession);
    return quizCode;
  }

  joinQuiz(quizCode: string, playerId: string, playerName: string,quizzes: Map<string, QuizSession>): boolean {
    const quiz = quizzes.get(quizCode);
    if (quiz && !quiz.hasStarted) {
      quiz.players.push({ pseudo:playerName, avatar : "",answers:[],score: 0 });
      return true;
    }
    return false;
  }

  startQuiz(quizCode: string,quizzes: Map<string, QuizSession>): any[] {
    const quizSession:QuizSession = quizzes.get(quizCode);
    const quiz=quizSession.quiz;
    if (quiz) {
      quizSession.hasStarted = true;
      return quiz.questions; // Send the questions to all players
    }
    return [];
  }

  findAll():Map<string,QuizSession>{
    return this.quizzes;
  }
  findOne(@MessageBody() code: string,quizzes: Map<string, QuizSession>) : QuizSession{
    if(!quizzes[code])
      return
    return
  }

  remove(code: string,quizzes: Map<string, QuizSession>) {
    quizzes.delete(code);
  }


}
