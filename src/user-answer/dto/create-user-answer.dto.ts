import {Column, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../../users/entities/user.entity";
import {Option} from "../../options/entities/option.entity";
import {Quiz} from "../../quizzes/entities/quiz.entity";

export class CreateUserAnswerDto {
    id: string;

   pseudo: string;

    answer: Option;

    quiz: Quiz;

}
