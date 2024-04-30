import { Column, DeleteDateColumn, Entity, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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

  @DeleteDateColumn()
  deletedAt: Date;
  
  @ManyToOne(
    ()=>User,
    (user:User)=>user.quizzes,
    { cascade: true}
  )
  user:User

  @OneToMany(
    ()=>Question,
    (question:Question)=>question.quiz,
    { eager: true }
  )
  questions:Question[]

  getId() {
    return this.id;
  }
}
