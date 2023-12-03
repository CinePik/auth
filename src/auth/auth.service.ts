import {
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { Observable, catchError, firstValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register.dto';
import { KeycloakService } from '../keycloak/keycloak.service';

type LoginResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly httpService: HttpService,
    private readonly keycloakService: KeycloakService,
  ) {}

  async login(username: string, password: string): Promise<LoginResponse> {
    const { access_token, expires_in, refresh_token, refresh_expires_in } =
      await this.keycloakService.login(username, password).catch((error) => {
        console.log(error);
        throw new UnauthorizedException(error);
      });

    return {
      access_token,
      refresh_token,
      expires_in,
      refresh_expires_in,
    };
  }

  async register(
    username: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<LoginResponse> {
    const { access_token, expires_in, refresh_token, refresh_expires_in } =
      await this.keycloakService
        .register(username, password, firstName, lastName)
        .catch((error) => {
          console.log(error);
          throw new UnauthorizedException(error);
        });

    return {
      access_token,
      refresh_token,
      expires_in,
      refresh_expires_in,
    };
  }

  async getProfile(token: string): Promise<any> {
    this.logger.debug(`getProfile: ${token}`);
    const data = await this.keycloakService
      .getUserInfo(token)
      .catch((error) => {
        console.log(error);
        throw new UnauthorizedException(error);
      });

    return data;
  }

  async refreshToken(token: string): Promise<any> {
    const data = await this.keycloakService
      .getUserInfo(token)
      .catch((error) => {
        console.log(error);
        throw new UnauthorizedException(error);
      });

    return data;
  }

  async logout(token: string): Promise<any> {
    const data = await this.keycloakService.logout(token).catch((error) => {
      console.log(error);
      throw new UnauthorizedException(error);
    });

    return data;
  }
}
