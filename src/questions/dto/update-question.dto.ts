import { PartialType } from '@nestjs/mapped-types';
import { CreateQuestionDto } from './create-question.dto';
import {Option} from "../../options/entities/option.entity";

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {
    id: string;

    text?:string

    options?:Option[]

    correctAnswer?: string

}
