import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { UserAnswerService } from './user-answer.service';
import { CreateUserAnswerDto } from './dto/create-user-answer.dto';
import { UpdateUserAnswerDto } from './dto/update-user-answer.dto';
import { SocketSessions } from 'src/web-socket/socket-session-manager.service'
import {Socket} from "socket.io";
import {Quiz} from "../quizzes/entities/quiz.entity";
import {User} from "../users/entities/user.entity";

@WebSocketGateway(3001)
export class UserAnswerGateway {
  private readonly socketSessions: SocketSessions[];
  private quiz : Quiz;
  private quizOwner:User;
  constructor(private readonly userAnswerService: UserAnswerService) {}

  handleConnection(socket: Socket) {
    const { code, pseudo } = socket.handshake.auth;
    if (!code || !pseudo) {
      // Disconnect the socket if code or pseudo is missing
      socket.disconnect();
      return;
    }

    const quizId = this.validateQuizCodeAndGetId(code);
    if (!quizId) {
      // Disconnect the socket if the code is invalid
      socket.disconnect();
      return;
    }
    // Associate the socket with the quiz ID and pseudonym
    this.socketSessions.setSocket( pseudo, socket);
  }
  @SubscribeMessage('createUserAnswer')
  create(@MessageBody() createUserAnswerDto: CreateUserAnswerDto) {
    return this.userAnswerService.create(createUserAnswerDto);
  }

  @SubscribeMessage('findAllUserAnswer')
  findAll() {
    return this.userAnswerService.findAll();
  }

  @SubscribeMessage('findOneUserAnswer')
  findOne(@MessageBody() id: string) {
    return this.userAnswerService.findOne(id);
  }

  @SubscribeMessage('updateUserAnswer')
  update(@MessageBody() updateUserAnswerDto: UpdateUserAnswerDto) {
    return this.userAnswerService.update(updateUserAnswerDto.id, updateUserAnswerDto);
  }

  @SubscribeMessage('removeUserAnswer')
  remove(@MessageBody() id: string) {
    return this.userAnswerService.remove(id);
  }

  private validateQuizCodeAndGetId(code: any) {
    return this.quiz.getId();
  }
}
