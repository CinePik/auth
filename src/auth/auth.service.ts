import { HttpException, Injectable, Logger } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { Observable, catchError, firstValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register.dto';

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

  async register(registerDto: RegisterDto): Promise<any> {
    //TODO(mevljas): use secrets from env
    const { data } = await firstValueFrom(
      this.httpService
        .post(
          'http://localhost:8080/admin/realms/cinepik/users',
          {
            username: registerDto.username,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            enabled: 'true',
            credentials: [
              {
                type: 'password',
                value: registerDto.password,
                temporary: false,
              },
            ],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: 'Bearer ' + (await this.getAdminToken()),
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

  async getAdminToken(): Promise<String> {
    //TODO(mevljas): use secrets from env
    const { data } = await firstValueFrom(
      this.httpService
        .post(
          'http://localhost:8080/realms/master/protocol/openid-connect/token',
          {
            grant_type: 'client_credentials',
            client_id: 'admin-cli',
            client_secret: 'CfzPhmFZujFCOi41goOmRZrlznXt1FcG',
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
    return data['access_token'];
  }
}
