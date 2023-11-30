import { Controller, Get, Request } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('me')
  getProfile(@Request() req) {
    // Guard will automatically invoke our passport-jwt custom configured strategy,
    // validate the JWT, and assign the user property to the Request object
    return req.user;
  }
}
