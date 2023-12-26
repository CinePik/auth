import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsAlphanumeric()
  @ApiProperty({
    description: "User's username.",
  })
  username: string;

  @IsAlphanumeric()
  @ApiProperty({
    description: "User's password.",
  })
  password: string;
}
