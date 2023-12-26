import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HttpModule } from '@nestjs/axios';
import { KeycloakService } from 'src/keycloak/keycloak.service';
import { KeycloakModule } from 'src/keycloak/keycloak.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [HttpModule, KeycloakModule],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
