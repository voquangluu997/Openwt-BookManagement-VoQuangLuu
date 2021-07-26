import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
// import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: (new ConfigService).get('GOOGLE_CLIENT_ID'),
      clientSecret: (new ConfigService).get('GOOGLE_SECRET'),
      callbackURL: (new ConfigService).get('GOOGLE_REDIRECT'),
      scope: ['email', 'profile'],
    });
  }  

  async validate(
    accessToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      avatar: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
