import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import{IoAdapter} from "@nestjs/platform-socket.io"
import { Server,Socket} from 'socket.io';
import { QuizSessionService } from './quiz-session.service';
import {QuizSession} from "./entities/quiz-session.entity";
import { JoinQuizDto } from "./dto/join-quiz-dto";

@WebSocketGateway(3001)
export class QuizSessionGateway {
  private quizzes =new Map();
  constructor(private readonly quizSessionService: QuizSessionService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createQuizSession')
  handleCreateQuizSession(@MessageBody() createQuizSessionDto: any, @ConnectedSocket() client: Socket): any{
    console.log("hellooooooooooo");
    const session = this.quizSessionService.createQuiz(createQuizSessionDto,this.quizzes);
    return session;
  }

  @SubscribeMessage('findAllQuizSession')
  handleFindAllQuizSession(@ConnectedSocket() client: Socket): any {
    console.log("le ileha ella lah")
    const sessions = this.quizSessionService.findAll();
    console.log(sessions);
    const jsonResult = {};
    sessions.forEach(function (value, key) {
      jsonResult[key] = value;
    });
    return  jsonResult;
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
  handleJoinQuiz(@MessageBody() data: JoinQuizDto, @ConnectedSocket() client: Socket): boolean {
    const { quizCode, playerName, avatar } = data;
    const result = this.quizSessionService.joinQuiz(quizCode, client.id, playerName,this.quizzes);
    if (!result) {
      client.join(quizCode)
      this.server.to(quizCode).emit('playerJoined', { id: client.id, playerName, avatar });
    } else {
      client.emit('errorMsg', 'Failed to join quiz.');
    }
    return (result)
  }



}
