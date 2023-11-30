import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  /**
   * Passport first verifies the JWT's signature and decodes the JSON.
   * It then invokes the validate() method passing the decoded JSON as its single parameter.
   * <p>
   * Passport will build a user object based on the return value of the validate() method,
   * and attach it as a property on the Request object.
   */
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
