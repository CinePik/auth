import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { KeycloakModule } from './keycloak/keycloak.module';

@Module({
  imports: [UsersModule, KeycloakModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
