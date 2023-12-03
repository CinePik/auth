import { Body, Controller, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, Unprotected } from 'nest-keycloak-connect';
import { LoginDto } from './dto/login.dto';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { RegisterDto } from './dto/register.dto';

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
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<Observable<AxiosResponse<any, any>>> {
    return this.authService.register(registerDto);
  }
}
