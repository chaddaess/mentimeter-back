import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto } from './create-question.dto';
import {Column, DeleteDateColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Quiz} from "../../quizzes/entities/quiz.entity";
import {Option} from "../../options/entities/option.entity";
import {IsArray, IsOptional, IsString, ValidateNested} from "class-validator";

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {
    @IsString()
    id: string;

    @IsString()
    @IsOptional()
    text?:string;

    @IsArray()
    @ValidateNested({ each: true })
    @IsOptional()
    options?:Option[];

    @IsString()
    @IsOptional()
    correctAnswer?: string;
}
