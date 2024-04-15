import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty(
    {
      message:"le champs $property  est obligatoire"
    }
  )
  @IsEmail()
  email:string;

  @IsNotEmpty({
    message:"le champs $property  est obligatoire"
  })
  @MinLength(6, {
      message: "la taile de votre $property $value est inférieure à la valeur minimale requise ($constraint1)"
    }
  )
  password:string;

}
