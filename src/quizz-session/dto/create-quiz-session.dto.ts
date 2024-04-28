import {Quiz} from "../../quizzes/entities/quiz.entity";
import {User} from "../../users/entities/user.entity";

export class CreateQuizSessionDto {
    quiz : Quiz;
    owner : User;


}
