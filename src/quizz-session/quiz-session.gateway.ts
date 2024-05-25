<<<<<<< HEAD
import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { QuizSessionService } from './quiz-session.service';
import {QuizSession} from "./entities/quiz-session.entity";
import {QuestionsService} from "../questions/questions.service";

function endQuiz() {

}

@WebSocketGateway(3001)
=======
import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import {QuizSessionService} from "./quiz-session.service";
import {QuizSession} from "./entities/quiz-session.entity";

@WebSocketGateway(3001, {cors: {origin: "*"}})
>>>>>>> 6c42a0851a8329236f33b678690cee8b175a2d8c
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

<<<<<<< HEAD
    const question = quiz.quiz.questions[questionNumber];
    if (!question) {
      // Handle error
      return;
=======
    // handleConnection(client: Socket) {
    //   console.log(client.id);
    // }

    sendLeaderboard(quizCode: string, leaderboard: any) {
        this.server.to(quizCode).emit('leaderboard', leaderboard);
>>>>>>> 6c42a0851a8329236f33b678690cee8b175a2d8c
    }
    this.server.to(quizCode).emit('question', question);
  }

<<<<<<< HEAD
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
=======
    @SubscribeMessage("createQuizSession") handleCreateQuizSession(@MessageBody() createQuizSessionDto: any, @ConnectedSocket() client: Socket): any {
        const session = this.quizSessionService.createQuiz(createQuizSessionDto, this.quizzes);
        client.emit("QuizCreationSuccess", `Quiz ${session} created successfully`);
        return client.emit("createQuizSession", session);
    }

    @SubscribeMessage("findAllQuizSession") handleFindAllQuizSession(@ConnectedSocket() client: Socket): any {
        console.log("le ileha ella lah");
        const sessions = this.quizSessionService.findAll();
        const jsonResult = {};
        sessions.forEach(function (value, key) {
            jsonResult[key] = value;
        });
        console.log(jsonResult);
        return client.emit("findAllQuizSession", jsonResult);
>>>>>>> 6c42a0851a8329236f33b678690cee8b175a2d8c
    }
  }

<<<<<<< HEAD

}
=======
    @SubscribeMessage("findOneQuizSession") handleFindOneQuizSession(@MessageBody() code: string, @ConnectedSocket() client: Socket): void {
        const session = this.quizSessionService.findOne(code, this.quizzes);
        client.emit("sessionDetail", session);
    }

    @SubscribeMessage("removeQuizSession") handleRemoveQuizSession(@MessageBody() id: string, @ConnectedSocket() client: Socket): void {
        const result = this.quizSessionService.remove(id, this.quizzes);
        client.emit("sessionRemoved", result);
    }

    @SubscribeMessage("joinQuiz") handleJoinQuiz(@MessageBody() data: any, @ConnectedSocket() client: Socket): boolean {
        // we should save the quiz code in the front
        const {quizCode, playerName, avatar} = data;
        console.log(data);
        const result = this.quizSessionService.joinQuiz(quizCode, client.id, playerName, this.quizzes);
        console.log(this.quizzes);
        if (result) {
            client.join(quizCode);
            this.server.to(quizCode).emit("playerJoined", {id: client.id, playerName, avatar});
        } else {
            client.emit("errorMsg", "Failed to join quiz.");
        }
        return (result);
    }

    @SubscribeMessage("getAnswer") getAnswer(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
        let {quizCode, answer, questionNumber, playerPseudo} = data;
        const quiz = this.quizzes[quizCode];
        const questions = quiz.questions;
        if (questionNumber > questions.length || questionNumber <= 0) {
            client.emit("getQuestion", "invalid request , check question number");
        } else {
            const question = questions[questionNumber];
            const player = quiz.players.find(player => {
                return player.pseudo === playerPseudo;
            });
            player.score += answer.validity ? 1 : 0;
            if (questionNumber + 1 > questions.length) {
                const resultArray = this.quizSessionService.processLeaderboard(quizCode);
                this.server.to(quizCode).emit("endQuiz", resultArray);
            } else {
                const nextQuestionNumber = questionNumber + 1;
                const nextQuestionData = {quizCode, nextQuestionNumber};
                this.sendQuestion(nextQuestionData);
            }
        }
    }


    @SubscribeMessage("sendQuestion") sendQuestion(data: any): void {
        console.log("sendy sendy 🤓");
        const {quizCode, questionNumber} = data;
        const quiz = this.quizzes.get(quizCode);
        if (!quiz) {
            this.server.to(quizCode).emit("error", `can't fetch quiz, it  has probably been deleted`);
            console.log("can't fetch quiz");
            return;
        }

        const question = quiz.questions[questionNumber];
        if (!question) {
            // Handle error
            this.server.to(quizCode).emit("error", `an error occured while retrieving question ${questionNumber}`);
            console.log("can't fetch question");
            return;
        }
        this.server.to(quizCode).emit("question", question);
    }

    endQuiz(quizCode: string, leaderboard: any): void {
        this.sendLeaderboard(quizCode, leaderboard)
    }
}
>>>>>>> 6c42a0851a8329236f33b678690cee8b175a2d8c
