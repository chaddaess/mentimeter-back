import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import process from "process";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { PayloadInterface } from "../Interfaces/payload.interface";
import {SECRET} from "jwt-constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository:Repository<User>,

  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:SECRET,
    });
  }

  async validate(payload: PayloadInterface) {
    let user:User=await this.userRepository.findOneBy({email:payload.email})
    if(!user){
      throw new UnauthorizedException()
    }
    delete(user.password)
    return user
  }
}