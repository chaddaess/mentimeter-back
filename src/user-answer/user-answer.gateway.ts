import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { UserAnswerService } from './user-answer.service';
import { CreateUserAnswerDto } from './dto/create-user-answer.dto';
import { UpdateUserAnswerDto } from './dto/update-user-answer.dto';
import { SocketSessions } from 'src/web-socket/socket-session-manager.service'

@WebSocketGateway()
export class UserAnswerGateway {
  private readonly socketSessions: SocketSessions,
  constructor(private readonly userAnswerService: UserAnswerService) {}

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
}
