import { Request } from 'express';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'cedula',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, email: string, cedula: string): Promise<any> {
    const user = await this.authService.validateUser({ email, cedula });

    if (!user) {
      throw new UnauthorizedException('Email o cédula incorrectos');
    }

    return user;
  }
}
