import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from "../users/dto/create-user.dto";
import { User } from "../users/entities/user.entity";
import { AuthGuard } from "@nestjs/passport";
import { ApiOperation, ApiTags } from "@nestjs/swagger";


@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @ApiTags('authentication')
  @ApiOperation({ summary: 'Creating an account' })
  @Post('/register')
  public  register(@Body() createUser:CreateUserDto):Promise<{}>{
     return  this.authenticationService.register(createUser)
  }

  @ApiTags('authentication')
  @ApiOperation({ summary: 'Logging in'})
  @Post('/login')
  public login (@Body() createUser:CreateUserDto) {
    return this.authenticationService.login(createUser)

  }

  /**
   * Endpoint  to login/register with Google
   * @param req
   */
  @ApiTags('authentication')
  @ApiOperation({ summary: 'Authenticate with Google', description: 'You need to run this in your BROWSER' })
  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req:any) { }

  /**
   * Callback endpoint upon a successful authentication with Google
   * @param req
   * @return jwt token
   */
  @Get('success')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req:any) {
    return this.authenticationService.googleLogin(req)
  }

}
