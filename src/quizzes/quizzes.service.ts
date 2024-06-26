import {Injectable} from "@nestjs/common";
import {Quiz} from "./entities/quiz.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {CrudService} from "../common/service/crud.service";
import {CreateQuizDto} from "./dto/create-quiz.dto";
import {Question} from "../questions/entities/question.entity";
import {Option} from "../options/entities/option.entity";
import {User} from "../users/entities/user.entity";

@Injectable()
export class QuizzesService extends CrudService<Quiz> {
    constructor(@InjectRepository(Quiz) private quizRepository: Repository<Quiz>, @InjectRepository(Question) private questionsRepository: Repository<Question>, @InjectRepository(Option) private optionsRepository: Repository<Option>, @InjectRepository(User) private userRepository: Repository<User>) {
        super(quizRepository);
    }

    async saveQuiz(createQuizDto: CreateQuizDto, userEmail : string) {
        const quiz: Quiz = new Quiz();
        const user = await this.userRepository.findOne({where: {email: userEmail}});
        quiz.user = user;
        console.log(quiz.user);
        quiz.name = createQuizDto.name;
        quiz.questions = createQuizDto.questions;
        quiz.topic = createQuizDto.topic;

        await this.addQuestions(quiz.questions); // Wait for questions and options to be added

        await this.quizRepository.save(quiz); // Save the quiz to the database
    }

    async addQuestions(questions: Question[]) {
        console.log(questions);
        const savedQuestions: Question[] = await this.questionsRepository.save(questions); // Save questions in bulk
        console.log(savedQuestions);
        // Prepare options for saving
        const optionsToSave: Option[] = [];
        for (const question of savedQuestions) {
            optionsToSave.push(...question.options);
        }

        await this.optionsRepository.save(optionsToSave); // Save options in bulk
    }
}