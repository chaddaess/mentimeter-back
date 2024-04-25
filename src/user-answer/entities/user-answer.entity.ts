import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Question } from "../../questions/entities/question.entity";
import { Quiz } from "../../quizzes/entities/quiz.entity";
import {Option} from "../../options/entities/option.entity";

@Entity()
export class UserAnswer {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, { nullable: true })
    user: User;

    @ManyToOne(() => Option)
    answer: Option;

    @OneToOne(() => Quiz, { nullable: true })
    quiz: Quiz;

    @Column({ nullable: true })
    pseudo: string;

    @Column({ nullable: true })
    avatar: string;
}
