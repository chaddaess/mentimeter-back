import { Column, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Question } from "../../questions/entities/question.entity";

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name:string
  @Column()
  code:string
  @Column()
  link:string
  @ManyToOne(
    ()=>User,
    (user:User)=>user.quizzes,
    { cascade: true}
  )
  user:User

  @OneToMany(
    ()=>Question,
    (question:Question)=>question.quiz,
  )
  questions:Question[]
}
