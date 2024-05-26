import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { QuizSessionService } from "./quiz-session.service";

@WebSocketGateway(3001, { cors: { origin: "*" } })
export class QuizSessionGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly quizSessionService: QuizSessionService) {
  }

    @SubscribeMessage('findAllQuizSession') handleFindAllQuizSession(@ConnectedSocket() client: Socket): any {
        const sessions = this.quizSessionService.findAll();
        const jsonResult = {};
        sessions.forEach((value, key) => {
            jsonResult[key] = value;
        });
        console.log(jsonResult)
        return client.emit('findAllQuizSession', jsonResult);
    }

    @SubscribeMessage('joinQuiz') handleJoinQuiz(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
        // we should save the quiz code in the front
        const {quizCode, playerName, avatar} = data;
        const result = this.quizSessionService.joinQuiz(quizCode, client.id, playerName, avatar);

        if (result) {
            client.join(quizCode);
            const quiz = this.quizSessionService.quizzes.get(quizCode);
            console.log("player joined", quizCode)
            this.server.to(quiz.ownerSocketId).emit('playerJoined', {id: client.id, playerName, avatar});
            this.server.to(client.id).emit('playerJoined', {id: client.id, playerName, avatar});
        } else {
            client.emit('errorMsg', 'Failed to join quiz.');
        }
    }

  @SubscribeMessage("sendQuestion")
  sendQuestion(@MessageBody() data: any): void {
    const { quizCode, questionNumber } = data;
    console.log("fetching question 🤓:", questionNumber);
    const quiz = this.quizSessionService.quizzes.get(quizCode);
    if (!quiz) {
      this.server.to(quizCode).emit("error", `can't fetch quiz, it has probably been deleted`);
      console.log("can't fetch quiz");
      return;
    }

    const questions = quiz.quiz.questions;
    const question = questions[questionNumber];
    if (!question) {
      this.server.to(quizCode).emit("error", `an error occurred while retrieving question ${questionNumber}`);
      console.log("can't fetch question");
      return;
    }

    this.server.to(quizCode).emit("question", { question: question, questionNumber: questionNumber });

    // Schedule next question if it exists
    if (questionNumber + 1 < questions.length) {
      setTimeout(() => {
        const nextQuestionNumber = questionNumber + 1;
        const nextQuestionData = { quizCode: quizCode, questionNumber: nextQuestionNumber };
        console.log("sending next question");
        this.sendQuestion(nextQuestionData);
      }, 10000);
    } else {
      // Last question, schedule quiz end after a delay
      setTimeout(() => {
        const resultArray = this.quizSessionService.processLeaderboard(quizCode);
        this.server.to(quizCode).emit("endQuiz", resultArray);
      }, 10000);
    }
  }


    sendLeaderboard(quizCode: string, leaderboard: any) {
        this.server.to(quizCode).emit("leaderboard", leaderboard);
    }

    @SubscribeMessage("createQuizSession") handleCreateQuizSession(@MessageBody() createQuizSessionDto: any, @ConnectedSocket() client: Socket): any {
        const session = this.quizSessionService.createQuiz(createQuizSessionDto, client.id);
        client.emit("QuizCreationSuccess", session);
        return client.emit("createQuizSession", session);
    }

  /*   @SubscribeMessage("findOneQuizSession")
     handleFindOneQuizSession(@MessageBody() code: string, @ConnectedSocket() client: Socket): void {
         const session = this.quizSessionService.findOne(code, this.quizzes);
         client.emit("sessionDetail", session);
     }
 */
  getScore(validity: boolean, questionStartTime : number): number {
    const timeLeft = Math.max(0, 20 - ((Date.now() - questionStartTime) / 1000));
    return validity ? timeLeft * 10 : 0;
  }

  @SubscribeMessage("getAnswer")
  getAnswer(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
    let { quizCode, answer, questionNumber, playerPseudo } = data;
    const quiz = this.quizSessionService.quizzes.get(quizCode);
    const questions = quiz.quiz.questions;
    if (questionNumber > questions.length || questionNumber < 0) {
      client.emit("getQuestion", "invalid request , check question number");
    } else {
      const question = questions[questionNumber];
      const player = quiz.players.find(player => {
        return player.pseudo === playerPseudo;
      });
      const questionStartTime = Date.now();
      const score = this.getScore(answer === question.correctAnswer, questionStartTime);
      player.score+= score;
      if (questionNumber + 1 > questions.length) {
        const resultArray = this.quizSessionService.processLeaderboard(quizCode);
        this.server.to(quizCode).emit("endQuiz", resultArray);
      }
    }
  }

    endQuiz(quizCode: string, leaderboard: any): void {
        this.sendLeaderboard(quizCode, leaderboard);
    }
}
