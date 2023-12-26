import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsJWT, IsNotEmpty, isNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @IsJWT()
  @ApiProperty({
    description: "User's refresh token.",
  })
  refreshToken: string;
}
