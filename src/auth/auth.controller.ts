import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, Unprotected } from 'nest-keycloak-connect';
import { LoginDto } from './dto/login.dto';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/login')
  @Unprotected()
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @Post('/register')
  @Unprotected()
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(
      registerDto.username,
      registerDto.password,
      registerDto.firstName,
      registerDto.lastName,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getProfile(@Request() req: Request) {
    const { authorization } = req.headers as any;

    const [, accessToken] = authorization.split(' ');

    return this.authService.getProfile(accessToken);
  }

  @Post('/refresh')
  refreshToken(@Body() body: RefreshTokenDto) {
    const { refreshToken: refreshToken } = body;

    return this.authService.refreshToken(refreshToken);
  }

  @Post('/logout')
  async logout(@Body() body: LogoutDto) {
    const { token: refreshToken } = body;

    await this.authService.logout(refreshToken);
  }
}
