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

  constructor(private readonly quizzSessionService: QuizSessionService) {}

  @SubscribeMessage('createQuizSession')
  create(@MessageBody() createQuizSessionDto: CreateQuizSessionDto) {
    return this.quizzSessionService.createQuiz(createQuizSessionDto);
  }

  @SubscribeMessage('findAllQuizzSession')
  findAll() {
    return this.quizzSessionService.findAll();
  }

  @SubscribeMessage('findOneQuizzSession')
  findOne(@MessageBody() code: string) {
    return this.quizzSessionService.findOne(code);
  }

  @SubscribeMessage('updateQuizzSession')
  update(@MessageBody() updateQuizzSessionDto: UpdateQuizSessionDto) {
    return this.quizzSessionService.update(updateQuizzSessionDto.id, updateQuizzSessionDto);
  }

  @SubscribeMessage('removeQuizzSession')
  remove(@MessageBody() id: number) {
    return this.quizzSessionService.remove(id);
  }

  @SubscribeMessage('joinQuiz')
  handleJoinQuiz(@ConnectedSocket() client: any, @MessageBody() data: { quizCode: string, playerName: string }): void {
    const { quizCode, playerName } = data;
    const result = this.quizService.joinQuiz(quizCode, client.id, playerName);
    if (result) {
      client.join(quizCode);
      this.server.to(quizCode).emit('playerJoined', { id: client.id, playerName });
    } else {
      client.emit('errorMsg', 'Failed to join quiz.');
    }
}
