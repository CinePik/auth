import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description:
      "Access token for authentication. Use this token in 'Authorization' header for protected endpoints",
  })
  access_token: string;

  @ApiProperty({
    description: 'Refresh token for refreshing user session.',
  })
  refresh_token: string;

  @ApiProperty({
    description: 'Access token validity in seconds.',
    default: '18000',
  })
  expires_in: number;

  @ApiProperty({
    description: 'Refresh token validity in seconds.',
    default: '35999',
  })
  refresh_expires_in: number;
}
