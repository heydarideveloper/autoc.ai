import { IsString, Matches, MinLength } from 'class-validator';

export class RegisterDto {
  @Matches(/^(\+?98|0)?9\d{9}$/)
  phone!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
