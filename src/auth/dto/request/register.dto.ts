import { IsAlphanumeric, IsEmail, IsAlpha } from 'class-validator';

export class RegisterDto {
  @IsAlphanumeric()
  username: string;

  @IsAlphanumeric()
  password: string;

  @IsEmail()
  email: string;

  @IsAlpha()
  firstName: string;

  @IsAlpha()
  lastName: string;
}
