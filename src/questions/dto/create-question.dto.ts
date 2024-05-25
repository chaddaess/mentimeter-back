import {Option} from "../../options/entities/option.entity";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsString, ValidateBy, ValidateNested } from 'class-validator'
import {Topic, Topics} from "../../quizzes/topics.enum";

export class CreateQuestionDto {
    @IsString()
    @IsNotEmpty()
    question: string

    @IsString({ each: true })
    @ArrayMaxSize(4)
    @IsNotEmpty()
    options: Option[]
}
