import { IsAlphanumeric } from 'class-validator';

export class LoginDto {
  @IsAlphanumeric()
  username: string;
  @IsAlphanumeric()
  password: string;
}
