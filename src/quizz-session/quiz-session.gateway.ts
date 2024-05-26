import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import {QuizSessionService} from "./quiz-session.service";

@WebSocketGateway(3001, {cors: {origin: "*"}})
export class QuizSessionGateway {
    @WebSocketServer() server: Server;

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
        const result = this.quizSessionService.joinQuiz(quizCode, client.id, playerName);

        if (result) {
            client.join(quizCode);
            console.log("player joined", quizCode)
            this.server.to(quizCode).emit('playerJoined', {id: client.id, playerName, avatar});
        } else {
            client.emit('errorMsg', 'Failed to join quiz.');
        }
    }

    @SubscribeMessage("sendQuestion") handleSendQuestion(@MessageBody() data: any): void {
        console.log("sendy sendy 🤓");
        const {quizCode, questionNumber} = data;
        const quiz = this.quizSessionService.quizzes.get(quizCode);
        console.log(quiz)

        if (!quiz) {
            this.server.to(quizCode).emit("error", `can't fetch quiz, it has probably been deleted`);
            console.log("can't fetch quiz");
            return;
        }

        const question = quiz.quiz.questions[questionNumber];
        console.log(question)
        if (!question) {
            // Handle error
            this.server.to(quizCode).emit("error", `An error occured while retrieving question ${questionNumber}`);
            console.log("can't fetch question");
            return;
        }
        this.server.to(quizCode).emit("question", question);
    }

    @SubscribeMessage("createQuizSession") handleCreateQuizSession(@MessageBody() createQuizSessionDto: any, @ConnectedSocket() client: Socket): any {
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

    @SubscribeMessage("getAnswer") handleGetAnswer(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
        let {quizCode, answer, questionNumber, playerPseudo} = data;
        const quiz = this.quizSessionService.quizzes.get(quizCode);
        const questions = quiz.quiz.questions;
        if (!quiz || questionNumber > questions.length || questionNumber <= 0) {
            client.emit("error", "invalid request , check question number");
            return;
        }
        const player = quiz.players.find(p => {
            return p.pseudo === playerPseudo;
        });
        if (player) {
            player.score += answer.validity ? 1 : 0;
        }

        if (questionNumber + 1 > questions.length) {
            const resultArray = this.quizSessionService.processLeaderboard(quizCode);
            this.server.to(quizCode).emit("endQuiz", resultArray);
        } else {
            const nextQuestionNumber = questionNumber + 1;
            const nextQuestionData = {quizCode, nextQuestionNumber};
            this.handleSendQuestion(nextQuestionData);
        }
    }

    sendLeaderboard(quizCode: string, leaderboard: any) {
        this.server.to(quizCode).emit('leaderboard', leaderboard);
    }

    endQuiz(quizCode: string, leaderboard: any): void {
        this.sendLeaderboard(quizCode, leaderboard)
    }
}
