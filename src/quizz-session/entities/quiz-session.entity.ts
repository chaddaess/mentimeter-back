import {players} from "./players.entity";
import {User} from "../../users/entities/user.entity";
import {Quiz} from "../../quizzes/entities/quiz.entity";

export class QuizSession {
    quiz : Quiz;
    quizCode: string;
    owner : User;
    hasStarted: boolean=false;
    players : players[];
}
