import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Unprotected } from 'nest-keycloak-connect';
import { LoginDto } from './dto/request/login.dto';
import { RegisterDto } from './dto/request/register.dto';
import { RefreshTokenDto } from './dto/request/refresh-token.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginResponseDto } from './dto/response/login-response.dto';
import { UserProfileResponseDto as UserInfoResponseDto } from './dto/response/user-info-response.dto copy';
import { RefreshTokenResponseDto } from './dto/response/refresh-token-response.dto';

@Controller('auth')
@ApiTags('auth')
@ApiInternalServerErrorResponse({
  description: 'There was an error processing this request.',
})
@ApiUnauthorizedResponse({
  description: 'User not authorized correctly.',
})
@ApiBadRequestResponse({
  description: 'Bad request.',
})
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/login')
  @ApiCreatedResponse({
    description: 'Login successful.',
    type: LoginResponseDto,
  })
  @Unprotected()
  @ApiOperation({
    summary: 'User login',
    description: 'Verifies user credentials and return the session token.',
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @Post('/register')
  @ApiCreatedResponse({
    description: 'Registration successful.',
  })
  @Unprotected()
  @ApiOperation({
    summary: 'User registration',
    description: 'Registers a new user.',
  })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.username,
      registerDto.password,
      registerDto.firstName,
      registerDto.lastName,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/userInfo')
  @ApiOkResponse({
    description: 'Returns user data.',
  })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'User info',
    description: 'Provides information about the current user.',
  })
  getUserInfo(@Request() req: Request): Promise<UserInfoResponseDto> {
    const { authorization } = req.headers as any;
    const [, accessToken] = authorization.split(' ');

    return this.authService.getProfile(accessToken);
  }

  @Post('/refresh')
  @Unprotected()
  @ApiCreatedResponse({
    description: 'User session validity extended.',
  })
  @ApiOperation({
    summary: 'Token refresh',
    description: 'Extends user session validity.',
  })
  refreshToken(
    @Body() body: RefreshTokenDto,
  ): Promise<RefreshTokenResponseDto> {
    const { refreshToken: refreshToken } = body;

    return this.authService.refreshToken(refreshToken);
  }

  @Post('/logout')
  @Unprotected()
  @ApiOperation({
    summary: 'User logout',
    description: 'Logouts the current user.',
  })
  @ApiCreatedResponse({
    description: 'User signed out.',
  })
  async logout(@Body() body: RefreshTokenDto) {
    const { refreshToken: refreshToken } = body;

    await this.authService.logout(refreshToken);
  }
}
