import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty(
    {
      message:"$property is compulsory"
    }
  )
  @IsEmail()
  email:string;

  @IsNotEmpty({
    message:"$property is compulsory"
  })
  @MinLength(6, {
      message: "the length of your  $property  is inferior to the minimum length required ($constraint1)"
    }
  )
  password?:string;

}
