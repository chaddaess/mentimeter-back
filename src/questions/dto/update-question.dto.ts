import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto } from './create-question.dto';
import {Column, DeleteDateColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Quiz} from "../../quizzes/entities/quiz.entity";
import {Option} from "../../options/entities/option.entity";

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {
    id: string;

    text?:string

    options?:Option[]

    correctAnswer?: string

}
