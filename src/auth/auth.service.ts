import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { KeycloakService } from '../keycloak/keycloak.service';
import { AxiosError } from 'axios';

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
      await this.keycloakService
        .login(username, password)
        .catch((error: AxiosError) => {
          const message = error.response.data;
          const status = error.response.status;

          this.logger.warn(`Login failed with status ${status}`, message);
          throw new HttpException(message, status);
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
          const message = error.response.data;
          const status = error.response.status;

          this.logger.warn(`Register failed with status ${status}`, message);
          throw new HttpException(message, status);
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
        const message = error.response.data;
        const status = error.response.status;

        this.logger.warn(`Get profile failed with status ${status}`, message);
        throw new HttpException(message, status);
      });

    return data;
  }

  async refreshToken(token: string): Promise<any> {
    const data = await this.keycloakService
      .refreshToken(token)
      .catch((error: AxiosError) => {
        const message = error.response.data;
        const status = error.response.status;

        this.logger.warn(`Refresh token failed with status ${status}`, message);
        throw new HttpException(message, status);
      });

    return data;
  }

  async logout(token: string): Promise<any> {
    const data = await this.keycloakService.logout(token).catch((error) => {
      const message = error.response.data;
      const status = error.response.status;

      this.logger.warn(`Logout failed with status ${status}`, message);
      throw new HttpException(message, status);
    });

    return data;
  }
}
