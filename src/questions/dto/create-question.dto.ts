import {Option} from "../../options/entities/option.entity";
import { ArrayMaxSize, IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator'

export class CreateQuestionDto {
    @IsString()
    @IsNotEmpty()
    question: string

    @IsArray()
    @ValidateNested({ each: true })
    @ArrayMaxSize(4)
    options: Option[]
}
