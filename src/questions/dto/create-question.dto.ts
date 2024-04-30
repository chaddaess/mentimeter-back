import {Option} from "../../options/entities/option.entity";
import { ArrayMaxSize, IsNotEmpty, IsString, ValidateBy } from 'class-validator'


export class CreateQuestionDto {
    @IsString()
    @IsNotEmpty()
    question: string

    // @IsString({ each: true })
    @ArrayMaxSize(4)
    @IsNotEmpty()
    options: Option[]

    // @ValidateBy({
    //     name: 'isCorrectAnswer',
    //     validator: {
    //         validate(value: string, args: any) {
    //             return args.object.options.includes(value)
    //         },
    //         defaultMessage(args: any) {
    //             return `${args.property} is not present in the options array.`
    //         },
    //     },
    // })
    @IsString()
    @IsNotEmpty()
    correctAnswer: string

}
