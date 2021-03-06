
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JWT_OPTIONS } from './auth.constants';
import { JwtOptions } from '../../common/interfaces/jwt-options.interface';
import { UserPayload } from '../../common/interfaces/user-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(JWT_OPTIONS) jwtOptions: JwtOptions,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtOptions.secret,
    });
  }

  async validate(payload: UserPayload, done: Function) {
    const user = await this.authService.validateUserPayload(payload);
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    done(null, user);
  }
}
