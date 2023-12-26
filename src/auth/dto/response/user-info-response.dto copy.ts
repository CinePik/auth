import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResponseDto {
  @ApiProperty({
    description: 'User identifier.',
  })
  sub: string;

  @ApiProperty({
    description: 'Whether the user has verified their email.',
  })
  email_verified: boolean;

  @ApiProperty({
    description: "User's full first name and surname.",
  })
  name: string;

  @ApiProperty({
    description: "User's username.",
  })
  username: string;

  @ApiProperty({
    description: "User's given name.",
  })
  given_name: string;

  @ApiProperty({
    description: "User's family name.",
  })
  family_name: string;

  @ApiProperty({
    description: "User's email.",
  })
  email: string;
}
