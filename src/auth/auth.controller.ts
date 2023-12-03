import { Body, Controller, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, Unprotected } from 'nest-keycloak-connect';
import { LoginDto } from './dto/login-dto/update-login-dto.dto';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/login')
  @Unprotected()
  async getPublic(
    @Body() loginDto: LoginDto,
  ): Promise<Observable<AxiosResponse<any, any>>> {
    return this.authService.login(loginDto);
  }
}
