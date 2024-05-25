import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { QuizSessionService } from './quiz-session.service';
import {QuizSession} from "./entities/quiz-session.entity";
import {QuestionsService} from "../questions/questions.service";
import {players} from "./entities/players.entity";

function endQuiz() {

}

@WebSocketGateway(3001)
export class QuizSessionGateway {
  private quizzes =new Map();
  constructor(private readonly quizSessionService: QuizSessionService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createQuizSession')
  handleCreateQuizSession(@MessageBody() createQuizSessionDto: any, @ConnectedSocket() client: Socket,): any{
    const session = this.quizSessionService.createQuiz(createQuizSessionDto);
    return client.emit('createQuizSession',session);
  }

  @SubscribeMessage('findAllQuizSession')
  handleFindAllQuizSession(@ConnectedSocket() client: Socket): any {
    console.log("le ileha ella lah")
    const sessions = this.quizSessionService.findAll();
    const jsonResult = {};
    sessions.forEach(function (value, key) {
      jsonResult[key] = value;
    });
    console.log(jsonResult)
    return  client.emit('findAllQuizSession',jsonResult);
  }

  @SubscribeMessage('findOneQuizSession')
  handleFindOneQuizSession(@MessageBody() code: string, @ConnectedSocket() client: Socket): void {
    const session = this.quizSessionService.findOne(code,this.quizzes);
    client.emit('sessionDetail', session);
  }

  @SubscribeMessage('removeQuizSession')
  handleRemoveQuizSession(@MessageBody() id: string, @ConnectedSocket() client: Socket): void {
    const result = this.quizSessionService.remove(id,this.quizzes);
    client.emit('sessionRemoved', result);
  }

  @SubscribeMessage('joinQuiz')
  handleJoinQuiz(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
    // we should save the quiz code in the front
    const { quizCode, playerName, avatar } = data;
    console.log(data)
    console.log(quizCode,playerName);
    const result = this.quizSessionService.joinQuiz(quizCode, client.id, playerName,this.quizzes);
    if (result) {
      client.join(quizCode);
      console.log("player joined",quizCode)
      this.server.to(quizCode).emit('playerJoined', { id: client.id, playerName, avatar });
    } else {
      client.emit('errorMsg', 'Failed to join quiz.');
    }
  }
  @SubscribeMessage('getQuestion')
  private sendQuestion(@MessageBody() data: any): void {
    const { quizCode, questionNumber } = data;
    const quiz = this.quizSessionService.quizzes.get(quizCode);
    console.log(data)
    console.log("hello",quizCode,quiz,quiz.quiz.questions,questionNumber)
    if (!quiz) {
      return;
    }

    const question = quiz.quiz.questions[questionNumber];
    if (!question) {
      // Handle error
      return;
    }

    this.server.to(quizCode).emit('question', question);
  }

  private endQuiz(): void {
    // Implement quiz ending logic
  }

  @SubscribeMessage('getAnswer')
  getAnswer(@MessageBody() data: any ,@ConnectedSocket() client: Socket): void {
    let {quizCode , answer , questionNumber,playerPseudo}=data;
    const quiz=this.quizzes[quizCode];
    const questions=quiz.questions;
    if(questionNumber > questions.length || questionNumber<=0 ){
      client.emit('getQuestion','invalid request , check question number');
    }
    else {
      const question = questions[questionNumber];
      const player = quiz.players.find(player  => {
        return player.pseudo=== playerPseudo
      });
      const questionStartTime = Date.now();
        const score = answer.validity ? Math.max(0, 20 - ((Date.now() - questionStartTime) / 1000)) * 10 : 0;
        player.score+= score;
      if(questionNumber+1 > questions.length ){
        endQuiz();
      }
      else{
        setTimeout(() => {
          const nextQuestionNumber = questionNumber + 1;
          const nextQuestionData = { quizCode, nextQuestionNumber };
          this.sendQuestion(nextQuestionData);
        }, 2000);
      }
    }
  }


}
