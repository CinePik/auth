import { Controller, Get, Request } from '@nestjs/common';
import { Unprotected, Roles, RoleMatchingMode } from 'nest-keycloak-connect';
import { UsersService } from './users.service';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('/public')
  @Unprotected()
  getpublic(): string {
    return `${this.usersService.getHello()} from public`;
  }
  @Get('/user')
  @Roles({ roles: ['realm:app-user'] })
  getUser(): string {
    return `${this.usersService.getHello()} from user`;
  }
  @Get('/admin')
  // @Roles({ roles: ['admin'] })
  @Roles({ roles: ['realm:app-admin'] })
  getAdmin(): string {
    return `${this.usersService.getHello()} from admin`;
  }
  @Get('/all')
  @Roles({ roles: ['admin', 'other'], mode: RoleMatchingMode.ALL })
  getAll(): string {
    return `${this.usersService.getHello()} from all`;
  }
  @Get('me')
  getProfile(@Request() req) {
    // Guard will automatically invoke our passport-jwt custom configured strategy,
    // validate the JWT, and assign the user property to the Request object
    return req.user;
  }
}
