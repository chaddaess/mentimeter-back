import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionsModule } from './questions/questions.module';
import { OptionsModule } from './options/options.module';
import { QuizzesModule } from './quizzes/quizzes.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from "@nestjs/typeorm";
import * as dotenv from 'dotenv'
import * as process from "process";
import { User } from "./users/entities/user.entity";
import { Question } from "./questions/entities/question.entity";
import { Quiz } from "./quizzes/entities/quiz.entity";
import { Option } from "./options/entities/option.entity";
import { AuthenticationModule } from './authentication/authentication.module';

dotenv.config();
@Module({
  imports: [
    UsersModule,
    QuizzesModule,
    OptionsModule,
    QuestionsModule,
    TypeOrmModule.forRoot(
      {
        'type':"mysql",
        host:"localhost",
        port:3306,
        username:process.env.DB_USERNAME,
        password:process.env.DB_PASSWORD,
        database:process.env.DB_NAME,
        entities:[User,Question,Quiz,Option],
        synchronize:true,
      }
    ),
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
