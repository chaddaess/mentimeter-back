import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from "../users/dto/create-user.dto";
import { User } from "../users/entities/user.entity";

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('/register')
  public  register(@Body() createUser:CreateUserDto):Promise<User>{
     return  this.authenticationService.register(createUser)
  }

  @Get('/login')
  public login (@Body() createUser:CreateUserDto) {
    return this.authenticationService.login(createUser)

  }
  @Get('/success')
  public redirectSuccess(){
    return "authorization successful"
  }

}
