import { IsNotEmpty, IsString } from "class-validator";

export class CreateQuestionDto {

    @IsNotEmpty()
    @IsString()
    text:string;
}
