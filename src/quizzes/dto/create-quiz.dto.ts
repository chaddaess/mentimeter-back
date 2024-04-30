import {IsEnum, IsNotEmpty} from "class-validator";
import {Topic, Topics} from "../topics.enum";
import {User} from "../../users/entities/user.entity";
import {Question} from "../../questions/entities/question.entity";

export class CreateQuizDto {
    id: string;

    name:string

    user:User

    questions:Question[]
    @IsEnum(Topics)
    @IsNotEmpty()
    topic: Topic

}
