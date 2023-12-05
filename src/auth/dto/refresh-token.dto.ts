import { IsAlphanumeric } from 'class-validator';

export class RefreshTokenDto {
  @IsAlphanumeric()
  refreshToken: string;
}
