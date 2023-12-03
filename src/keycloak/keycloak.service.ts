import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

type LoginResponse = {
  access_token: string;
  scope: string;
  refresh_token: string;
  token_type: string;
  session_state: string;
  'not-before-policy': number;
  refresh_expires_in: number;
  expires_in: number;
};

type UserInfoResponse = {
  sub: string;
  email_verified: boolean;
  preferred_username: string;
};

@Injectable()
export class KeycloakService {
  private baseURL: string;
  private realm: string;
  private clientId: string;
  private clientSecret: string;
  private adminClientSecret: string;
  private readonly logger = new Logger(KeycloakService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.baseURL = this.configService.get('KEYCLOAK_BASE_URL');
    this.realm = this.configService.get('KEYCLOAK_REALM');
    this.clientId = this.configService.get('KEYCLOAK_CLIENT_ID');
    this.clientSecret = this.configService.get('KEYCLOAK_CLIENT_SECRET');
    this.adminClientSecret = this.configService.get(
      'KEYCLOAK_ADMIN_CLIENT_SECRET',
    );
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const { data } = await firstValueFrom(
      this.httpService
        .post(
          `${this.baseURL}/realms/${this.realm}/protocol/openid-connect/token`,
          new URLSearchParams({
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: 'password',
            username,
            password,
          }),
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);
            throw new UnauthorizedException(error);
          }),
        ),
    );

    return data;
  }

  async register(
    username: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<LoginResponse> {
    const { data } = await firstValueFrom(
      this.httpService
        .post(
          `${this.baseURL}/admin/realms/${this.realm}/users`,
          {
            username,
            firstName,
            lastName,
            enabled: 'true',
            credentials: [
              {
                type: 'password',
                value: password,
                temporary: false,
              },
            ],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization:
                'Bearer ' + (await this.getAdminToken()).access_token,
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error);
            throw new UnauthorizedException(error);
          }),
        ),
    );

    return data;
  }

  async getAdminToken(): Promise<LoginResponse> {
    const { data } = await firstValueFrom(
      this.httpService
        .post(
          `${this.baseURL}/realms/master/protocol/openid-connect/token`,
          {
            grant_type: 'client_credentials',
            client_id: 'admin-cli',
            client_secret: this.adminClientSecret,
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

  async getUserInfo(accessToken: string): Promise<UserInfoResponse> {
    const { data } = await firstValueFrom(
      this.httpService.get(
        `${this.baseURL}/realms/${this.realm}/protocol/openid-connect/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      ),
    );

    return data;
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const { data } = await firstValueFrom(
      this.httpService.post(
        `${this.baseURL}/auth/realms/${this.realm}/protocol/openid-connect/token`,
        new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      ),
    );

    return data;
  }

  async logout(refreshToken: string) {
    await firstValueFrom(
      this.httpService.post(
        `${this.baseURL}/auth/realms/${this.realm}/protocol/openid-connect/logout`,
        new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken,
        }),
      ),
    );
  }
}
