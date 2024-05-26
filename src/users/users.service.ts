import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import {CrudService} from "../common/service/crud.service";
import {Question} from "../questions/entities/question.entity";

@Injectable()
export class UsersService extends CrudService<User> {

  constructor(
    @InjectRepository(User)
      private userRepository : Repository<User>
  )
  {
    super(userRepository);
  }
}
