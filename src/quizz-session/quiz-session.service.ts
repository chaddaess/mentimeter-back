import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateQuizSessionDto} from './dto/create-quiz-session.dto';
import {v4 as uuidv4} from 'uuid';
import {QuizSession} from "./entities/quiz-session.entity";

@Injectable()
export class QuizSessionService {

    quizzes: Map<string, QuizSession> = new Map();

    createQuiz(quizDto: CreateQuizSessionDto, quizzes: Map<any, any>): string {
        const quizCode = uuidv4();
        console.log(quizCode)
        const {quiz, owner} = quizDto;
        console.log(quiz);
        const quizSession: QuizSession = {quiz: quiz, quizCode: quizCode, owner: owner, hasStarted: false, players: []}
        this.quizzes.set(quizCode, quizSession);
        quizzes.set(quizCode, quizSession);
        return quizCode;
    }

  joinQuiz(quizCode: string, playerId: string, playerName: string,quizzes: Map<string, QuizSession>): boolean {
    const quiz = this.quizzes.get(quizCode);
    console.log(quizCode);
    console.log(quiz)
    console.log(this.quizzes)
    if (quiz) {
      quiz.players.push({ pseudo:playerName, avatar : "",answers:[],score: 0 });
      console.log("hello")
      return true;
    }
    return false;
  }

    startQuiz(quizCode: string, quizzes: Map<string, QuizSession>): any[] {
        const quizSession: QuizSession = quizzes.get(quizCode);
        const quiz = quizSession.quiz;
        if (quiz) {
            quizSession.hasStarted = true;
            return quiz.questions; // Send the questions to all players
        }
        throw new NotFoundException(`Quiz session with code ${quizCode} not found`);
    }





    processLeaderboard(quizCode: string) {
        const quizSession = this.quizzes.get(quizCode);
        if (quizSession) {
            const leaderboard = quizSession.players
                .sort((a, b) => b.score - a.score)
                .map((player, index) => ({
                    rank: index + 1, pseudo: player.pseudo, score: player.score,
                }));
            return leaderboard;
        }
    }

    // processLeaderboard(quizCode: string) {
    //     const leaderboard = [{
    //         id: 1, name: "Eva Green", score: 225, avatar: "https://randomuser.me/api/portraits/women/24.jpg"
    //     }, {id: 2, name: "James Smith", score: 200, avatar: "https://randomuser.me/api/portraits/men/24.jpg"}, {
    //         id: 3, name: "Isabella Johnson", score: 250, avatar: "https://randomuser.me/api/portraits/women/25.jpg"
    //     }, {
    //         id: 4, name: "Ethan Williams", score: 195, avatar: "https://randomuser.me/api/portraits/men/25.jpg"
    //     }, {
    //         id: 5, name: "Sophia Brown", score: 180, avatar: "https://randomuser.me/api/portraits/women/26.jpg"
    //     }, {
    //         id: 6, name: "Daniel Davis", score: 210, avatar: "https://randomuser.me/api/portraits/men/26.jpg"
    //     }, {
    //         id: 7, name: "Olivia Garcia", score: 205, avatar: "https://randomuser.me/api/portraits/women/27.jpg"
    //     }, {
    //         id: 8, name: "Matthew Rodriguez", score: 175, avatar: "https://randomuser.me/api/portraits/men/27.jpg"
    //     }, {
    //         id: 9, name: "Ava Martinez", score: 230, avatar: "https://randomuser.me/api/portraits/women/28.jpg"
    //     }, {
    //         id: 10, name: "Michael Hernandez", score: 190, avatar: "https://randomuser.me/api/portraits/men/28.jpg"
    //     }, {
    //         id: 11, name: "Emily Gonzalez", score: 215, avatar: "https://randomuser.me/api/portraits/women/29.jpg"
    //     }, {
    //         id: 12, name: "Jacob Wilson", score: 165, avatar: "https://randomuser.me/api/portraits/men/29.jpg"
    //     }, {
    //         id: 13, name: "Mia Anderson", score: 220, avatar: "https://randomuser.me/api/portraits/women/30.jpg"
    //     }, {
    //         id: 14, name: "Alexander Thomas", score: 160, avatar: "https://randomuser.me/api/portraits/men/30.jpg"
    //     }];
    //     return leaderboard;
    // }

    findAll(): Map<string, QuizSession> {
        return this.quizzes;
    }

    findOne(code: string, quizzes: Map<string, QuizSession>): QuizSession {
        if (!quizzes[code]) throw new NotFoundException(`Quiz session with code ${code} not found`);
        return quizzes[code];
    }

    remove(code: string, quizzes: Map<string, QuizSession>) {
        if (!quizzes.delete(code)) {
            throw new NotFoundException(`Quiz session with code ${code} not found`);
        }
    }
}
