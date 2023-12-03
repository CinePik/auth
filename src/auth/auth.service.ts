import { HttpException, Injectable, Logger } from '@nestjs/common';
import { LoginDto } from './dto/login-dto/update-login-dto.dto';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { Observable, catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private readonly httpService: HttpService) {}

  async login(loginDto: LoginDto): Promise<any> {
    //TODO(mevljas): use secrets from env
    const { data } = await firstValueFrom(
      this.httpService
        .post(
          'http://localhost:8080/realms/cinepik/protocol/openid-connect/token',
          {
            username: loginDto.username,
            password: loginDto.password,
            client_id: 'nest-auth',
            client_secret: 'kDTL1eSxPIFR8Ai0UXjvzYkaZVpy2M6c',
            grant_type: 'password',
            scope: 'openid',
          },
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw new HttpException(error.response.data, error.response.status);
          }),
        ),
    );
    return data;
  }
}
