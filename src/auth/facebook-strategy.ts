import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: new ConfigService().get('FB_APP_ID'),
      clientSecret: new ConfigService().get('FB_APP_SECRET'),
      callbackURL: new ConfigService().get('FB_REDIRECT'),
      scope: 'email',
      profileFields: ['emails', 'name', 'picture.type(large)'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void,
  ): Promise<any> {
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      avatar: profile.photos ? profile.photos[0].value : '',
    };
    const payload = {
      user,
      accessToken,
    };

    done(null, payload);
  }
}