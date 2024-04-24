import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Quiz } from "../../quizzes/entities/quiz.entity";
import { Option } from "../../options/entities/option.entity";

@Entity()
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  text:string

  @DeleteDateColumn()
  deletedAt: Date;
  
  @ManyToOne(
    ()=>Quiz,
    (quiz:Quiz)=>quiz.questions
  )
  quiz:Quiz
  @OneToMany(
    ()=>Option,
    (option:Option)=>option.question
  )
  options:Option[]
}
