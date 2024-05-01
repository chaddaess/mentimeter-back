import { Injectable } from '@nestjs/common';
import { Quiz } from './entities/quiz.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CrudService } from '../common/service/crud.service';

@Injectable()
export class QuizzesService extends CrudService<Quiz>{
  constructor(
    @InjectRepository(Quiz)
    private quizRepository: Repository<Quiz>,
  ) {
      super(quizRepository);
  }

  async findQuizByUserId(userId: string): Promise<Quiz[]> {
    const qb=this.quizRepository.createQueryBuilder("quiz");
    qb.select("quiz")
        .innerJoin("quiz.user","user")
        .where('user.id = :userId', { userId });
    console.log(qb.getSql());
    return await qb.getRawMany();
  }
}
