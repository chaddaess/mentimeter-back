import {WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket} from '@nestjs/websockets';
import { QuizSessionService } from './quiz-session.service';
import { CreateQuizSessionDto } from './dto/create-quiz-session.dto';
import { UpdateQuizSessionDto } from './dto/update-quiz-session.dto';
import {QuizzesService} from "../quizzes/quizzes.service";
import {Server} from "socket.io";

@WebSocketGateway()
export class QuizSessionGateway {


  @WebSocketServer()
  server: Server;

  constructor(private readonly quizSessionService: QuizSessionService) {}

  @SubscribeMessage('createQuizSession')
  create(@MessageBody() createQuizSessionDto: CreateQuizSessionDto) {
    return this.quizSessionService.createQuiz(createQuizSessionDto);
  }

  @SubscribeMessage('findAllQuizSession')
  findAll() {
    return this.quizSessionService.findAll();
  }

  @SubscribeMessage('findOneQuizSession')
  findOne(@MessageBody() code: string) {
    return this.quizSessionService.findOne(code);
  }

  @SubscribeMessage('updateQuizSession')
  update(@MessageBody() updateQuizSessionDto: UpdateQuizSessionDto) {
    return this.quizSessionService.update(updateQuizSessionDto.id, updateQuizSessionDto);
  }

  @SubscribeMessage('removeQuizSession')
  remove(@MessageBody() id: number) {
    return this.quizSessionService.remove(id);
  }

  @SubscribeMessage('joinQuiz')
  handleJoinQuiz(@ConnectedSocket() client: any, @MessageBody() data: { quizCode: string, playerName: string }): void {
    const { quizCode, playerName } = data;
    const result = this.quizSessionService.joinQuiz(quizCode, client.id, playerName);
    if (result) {
      client.join(quizCode);
      this.server.to(quizCode).emit('playerJoined', { id: client.id, playerName });
    } else {
      client.emit('errorMsg', 'Failed to join quiz.');
    }
}}
