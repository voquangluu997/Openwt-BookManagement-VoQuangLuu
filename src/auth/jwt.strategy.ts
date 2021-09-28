import { ConfigService } from '@nestjs/config';
import { JwtPayload, JwtPayload2 } from './jwt-payload.interface';
import { UsersRepository } from './user.repository';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt } from 'passport-jwt';
import { User } from './user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UsersRepository) private usersRepository: UsersRepository,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  // async validate(payload: JwtPayload): Promise<User> {
  //   const { email } = payload;
  //   const user: User = await this.usersRepository.findOne({ email });

  //   if (!user) {
  //     throw new UnauthorizedException("no no ");
  //   }
  //   return user;
  // }

  async validate(payload: JwtPayload2) {
    const [userId, email] = [
      payload[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
      ],
      payload[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
      ],
    ];
    console.log('pay : ', payload);
    return {userId,email };
  }
}
