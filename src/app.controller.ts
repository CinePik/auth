import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Unprotected } from 'nest-keycloak-connect';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Unprotected()
  getHello(): string {
    return this.appService.getHello();
  }
}
