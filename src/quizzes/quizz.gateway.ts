import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import {  WebSocketServer, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import {QuizzesService} from "./quizzes.service";
import {Server} from "socket.io";

@WebSocketGateway()
export class QuizzGateway {

  }


}
