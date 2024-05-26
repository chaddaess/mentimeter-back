import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import {QuizSessionService} from "./quiz-session.service";
import {QuizSession} from "./entities/quiz-session.entity";

@WebSocketGateway(3001, {cors: {origin: "*"}})
export class QuizSessionGateway {
  constructor(private readonly quizSessionService: QuizSessionService) {}

  @WebSocketServer()
  server: Server;

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
  @SubscribeMessage('joinQuiz')
  handleJoinQuiz(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
    // we should save the quiz code in the front
    const { quizCode, playerName, avatar } = data;
    console.log(data)
    console.log(quizCode,playerName);
    const result = this.quizSessionService.joinQuiz(quizCode, client.id, playerName);
    if (result) {
      client.join(quizCode);
      console.log("player joined",quizCode)
      this.server.to(quizCode).emit('playerJoined', { id: client.id, playerName, avatar });
    } else {
      client.emit('errorMsg', 'Failed to join quiz.');
    }
  }
  @SubscribeMessage("sendQuestion")
  sendQuestion(@MessageBody() data: any): void {
          console.log("sendy sendy 🤓");
          const {quizCode, questionNumber} = data;
          const quiz = this.quizSessionService.quizzes.get(quizCode);
          console.log(quiz)
          if (!quiz) {
          this.server.to(quizCode).emit("error", `can't fetch quiz, it  has probably been deleted`);
          console.log("can't fetch quiz");
          return;
      }

      const question = quiz.quiz.questions[questionNumber];
          console.log(question)
      if (!question) {
          // Handle error
          this.server.to(quizCode).emit("error", `an error occured while retrieving question ${questionNumber}`);
          console.log("can't fetch question");
          return;
      }
      this.server.to(quizCode).emit("question", question);
  }
      sendLeaderboard(quizCode: string, leaderboard: any) {
          this.server.to(quizCode).emit('leaderboard', leaderboard);
      }
    @SubscribeMessage("createQuizSession")
    handleCreateQuizSession(@MessageBody() createQuizSessionDto: any, @ConnectedSocket() client: Socket): any {
        const session = this.quizSessionService.createQuiz(createQuizSessionDto);
        client.emit("QuizCreationSuccess", `Quiz ${session} created successfully`);
        return client.emit("createQuizSession", session);
    }

 /*   @SubscribeMessage("findOneQuizSession")
    handleFindOneQuizSession(@MessageBody() code: string, @ConnectedSocket() client: Socket): void {
        const session = this.quizSessionService.findOne(code, this.quizzes);
        client.emit("sessionDetail", session);
    }
*/
    @SubscribeMessage("getAnswer")
    getAnswer(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
        let {quizCode, answer, questionNumber, playerPseudo} = data;
        const quiz = this.quizSessionService.quizzes.get(quizCode);
        const questions = quiz.quiz.questions;
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

    endQuiz(quizCode: string, leaderboard: any): void {
        this.sendLeaderboard(quizCode, leaderboard)
    }
}
