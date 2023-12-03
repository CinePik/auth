import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { KeycloakService } from 'src/keycloak/keycloak.service';
import { KeycloakModule } from 'src/keycloak/keycloak.module';

@Module({
  imports: [UsersModule, HttpModule, KeycloakModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
