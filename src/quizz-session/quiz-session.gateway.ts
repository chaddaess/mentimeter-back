import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { QuizSessionService } from "./quiz-session.service";

function endQuiz() {
  console.log("quiz ended !!");
}

@WebSocketGateway(3001, { cors: { origin: "*" } })
export class QuizSessionGateway {

  @WebSocketServer() server: Server;
  private quizzes = new Map();

  constructor(private readonly quizSessionService: QuizSessionService) {
  }

  handleConnection(client: Socket) {
    console.log(client.id);
  }

  @SubscribeMessage("createQuizSession") handleCreateQuizSession(@MessageBody() createQuizSessionDto: any, @ConnectedSocket() client: Socket): any {
    const session = this.quizSessionService.createQuiz(createQuizSessionDto, this.quizzes);
    client.emit("QuizCreationSuccess", `Quiz ${session} created successfully`);
    return client.emit("createQuizSession", session);
  }

  @SubscribeMessage("findAllQuizSession") handleFindAllQuizSession(@ConnectedSocket() client: Socket): any {
    console.log("le ileha ella lah");
    const sessions = this.quizSessionService.findAll();
    const jsonResult = {};
    sessions.forEach(function(value, key) {
      jsonResult[key] = value;
    });
    console.log(jsonResult);
    return client.emit("findAllQuizSession", jsonResult);
  }

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
    const { quizCode, playerName, avatar } = data;
    console.log(data);
    const result = this.quizSessionService.joinQuiz(quizCode, client.id, playerName, this.quizzes);
    console.log(this.quizzes);
    if (result) {
      client.join(quizCode);
      this.server.to(quizCode).emit("playerJoined", { id: client.id, playerName, avatar });
    } else {
      client.emit("errorMsg", "Failed to join quiz.");
    }
    return (result);
  }

  @SubscribeMessage("getAnswer")
  getAnswer(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
    let { quizCode, answer, questionNumber, playerPseudo } = data;
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
        //TODO: calculate scores and send data as a payload to endQuiz event
        //dummy result payload for now
        const resultArray = [{
          id: 1, name: "Eva Green", score: 225, avatar: "https://randomuser.me/api/portraits/women/24.jpg"
        }, { id: 2, name: "James Smith", score: 200, avatar: "https://randomuser.me/api/portraits/men/24.jpg" }, {
          id: 3,
          name: "Isabella Johnson",
          score: 250,
          avatar: "https://randomuser.me/api/portraits/women/25.jpg"
        }, {
          id: 4, name: "Ethan Williams", score: 195, avatar: "https://randomuser.me/api/portraits/men/25.jpg"
        }, {
          id: 5, name: "Sophia Brown", score: 180, avatar: "https://randomuser.me/api/portraits/women/26.jpg"
        }, {
          id: 6, name: "Daniel Davis", score: 210, avatar: "https://randomuser.me/api/portraits/men/26.jpg"
        }, {
          id: 7, name: "Olivia Garcia", score: 205, avatar: "https://randomuser.me/api/portraits/women/27.jpg"
        }, {
          id: 8,
          name: "Matthew Rodriguez",
          score: 175,
          avatar: "https://randomuser.me/api/portraits/men/27.jpg"
        }, {
          id: 9, name: "Ava Martinez", score: 230, avatar: "https://randomuser.me/api/portraits/women/28.jpg"
        }, {
          id: 10,
          name: "Michael Hernandez",
          score: 190,
          avatar: "https://randomuser.me/api/portraits/men/28.jpg"
        }, {
          id: 11,
          name: "Emily Gonzalez",
          score: 215,
          avatar: "https://randomuser.me/api/portraits/women/29.jpg"
        }, {
          id: 12, name: "Jacob Wilson", score: 165, avatar: "https://randomuser.me/api/portraits/men/29.jpg"
        }, {
          id: 13, name: "Mia Anderson", score: 220, avatar: "https://randomuser.me/api/portraits/women/30.jpg"
        }, {
          id: 14,
          name: "Alexander Thomas",
          score: 160,
          avatar: "https://randomuser.me/api/portraits/men/30.jpg"
        } // Add more if necessary
        ];
        this.server.to(quizCode).emit("endQuiz", resultArray);
        endQuiz();
      } else {
        const nextQuestionNumber = questionNumber + 1;
        const nextQuestionData = { quizCode, nextQuestionNumber };
        this.sendQuestion(nextQuestionData);
      }
    }
  }


  @SubscribeMessage("sendQuestion")
  sendQuestion(data: any): void {
    console.log("sendy sendy 🤓");
    const { quizCode, questionNumber } = data;
    const quiz = this.quizzes.get(quizCode);
    if (!quiz) {
      this.server.to(quizCode).emit("error",`can't fetch quiz, it  has probably been deleted`);
      console.log("can't fetch quiz");
      return;
    }

    const question = quiz.questions[questionNumber];
    if (!question) {
      // Handle error
      this.server.to(quizCode).emit("error",`an error occured while retieving question ${questionNumber}`);
      console.log("can't fetch question");

      return;
    }
    this.server.to(quizCode).emit("question", question);
  }

  endQuiz(): void {
    // Implement quiz ending logic
  }
}