import { User } from './user.entity';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UsersRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EXCEPTION_MESSAGE } from '../constants';
import { CreateUserDto } from './dto/create-user.dto';
import sendEmail from 'utils/sendEmail';
import { HttpService } from '@nestjs/axios';
import { map, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { response } from 'express';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private httpService: HttpService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    return this.usersRepository.createUser(createUserDto);
  }

  async login(authCredentialsDto: AuthCredentialsDto) {
    const accessToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImVkYzkxZTA0LTA4MTctNDBmZS1hMjNkLTYxMjNmZjliNWNmOSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3N1cm5hbWUiOiJzdHJpbmciLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9naXZlbm5hbWUiOiJsaXUiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJ1c2VyMUBleGFtcGxlLmNvbSIsImlzcyI6IkF1dGhlbnRpY2F0aW9uU2VydmVyIiwiYXVkIjoiQ2xpZW50In0.s0RcQFwCF07UtHi44ZHkM7PIrSI5su4AHj1K0Frwh9M';
    // const accessToken: string = await this.jwtService.sign(payload, {
    //   algorithm: 'HS256',
    // });
    const verify = this.jwtService.verify(accessToken);

    const { email, password } = authCredentialsDto;
    // const user = await this.usersRepository.findOne({ email });

    // if (user && (await bcrypt.compare(password, user.password))) {
    //   const payload: JwtPayload = { email };
    //   const accessToken =
    //     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImVkYzkxZTA0LTA4MTctNDBmZS1hMjNkLTYxMjNmZjliNWNmOSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3N1cm5hbWUiOiJzdHJpbmciLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9naXZlbm5hbWUiOiJsaXUiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJ1c2VyMUBleGFtcGxlLmNvbSIsImlzcyI6IkF1dGhlbnRpY2F0aW9uU2VydmVyIiwiYXVkIjoiQ2xpZW50In0.s0RcQFwCF07UtHi44ZHkM7PIrSI5su4AHj1K0Frwh9M';
    //   // const accessToken: string = await this.jwtService.sign(payload, {
    //   //   algorithm: 'HS256',
    //   // });
    //   const verify = this.jwtService.verify(accessToken);

    return { accessToken, verify };
    // } else {
    // throw new UnauthorizedException(EXCEPTION_MESSAGE.UNAUTHORIZED);
    // }
  }

  fn(): Observable<AxiosResponse<any>> {
    console.log(
      'ok',
      this.httpService
        .get('http://allfilm.mediadnnb.codes:5001/api/v1/film?limit=6&offset=1')
        .pipe(
          map((response) => {
            console.log('hi', response, response.data);
            return response.data;
          }),
        ),
    );
    return;
  }

  async fs(info, user) {
    console.log('in: ', info);
    console.log('user: ', user);
    // return 'ok';
    return await this.httpService
      .post('https://auth.habit-dev.novahub.vn/api/auth/signin', info)
      .pipe(
        map((res) => {
          console.log('d', res.data);
          return res.data;
        }),
      );
  }

  async googleLogin(req) {
    let user = req.user;
    let res, ggUser;

    if (!user) {
      throw new NotFoundException('No user from google');
    }

    let { email, firstName, lastName, avatar } = user;

    try {
      const found = await this.usersRepository.findOne({
        email,
      });

      if (found) {
        ggUser = this.usersRepository.create({
          email,
          firstName: found.firstName,
          lastName: found.lastName,
          avatar: found.avatar == '' ? avatar : found.avatar,
        });

        const payload: JwtPayload = { email };
        const accessToken: string = await this.jwtService.sign(payload);

        res = { user: ggUser, accessToken };
      } else {
        const defaultPassword = email;
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(defaultPassword, salt);

        ggUser = {
          email,
          firstName,
          lastName,
          avatar,
        };

        try {
          await this.usersRepository.save({
            ...ggUser,
            ...{ password: hashPassword },
          });

          const payload: JwtPayload = { email };
          const accessToken: string = await this.jwtService.sign(payload);
          res = { user: ggUser, accessToken };
        } catch (err) {
          throw new InternalServerErrorException(
            'Create accout from FB failed',
          );
        }
      }
    } catch (error) {
      throw new InternalServerErrorException('Query google user failed');
    }

    var responseHTML =
      '<html><head><title>Main</title></head><body></body><script>let res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>';
    responseHTML = responseHTML.replace(
      '%value%',
      JSON.stringify({
        userInfo: res,
      }),
    );
    return responseHTML;
  }

  async FBLogin(req) {
    let user = req.user;
    let res, ggUser;

    if (!user) {
      throw new NotFoundException('No user from facebook');
    }

    let { email, firstName, lastName, avatar } = user;

    try {
      const found = await this.usersRepository.findOne({
        email,
      });

      if (found) {
        ggUser = this.usersRepository.create({
          email,
          firstName: found.firstName,
          lastName: found.lastName,
          avatar: found.avatar == '' ? avatar : found.avatar,
        });

        const payload: JwtPayload = { email };
        const accessToken: string = await this.jwtService.sign(payload);

        res = { user: ggUser, accessToken };
      } else {
        const defaultPassword = email;
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(defaultPassword, salt);
        ggUser = {
          email,
          firstName,
          lastName,
          avatar,
          else: true,
        };
        try {
          await this.usersRepository.save({
            ...ggUser,
            ...{ password: hashPassword },
          });
          const payload: JwtPayload = { email };
          const accessToken: string = await this.jwtService.sign(payload);
          res = { user: ggUser, accessToken };
        } catch (err) {
          throw new InternalServerErrorException(
            'Create accout from FB failed',
          );
        }
      }
    } catch (error) {
      throw new InternalServerErrorException('Query facebook user failed');
    }

    var responseHTML =
      '<html><head><title>Main</title></head><body></body><script>let res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>';
    responseHTML = responseHTML.replace(
      '%value%',
      JSON.stringify({
        userInfo: res,
      }),
    );
    return responseHTML;
  }

  async sendResetLink(
    email: string,
  ): Promise<{ message: string; token: string; email: string }> {
    let token: string;
    try {
      const user = await this.usersRepository.findOne({ email });
      if (!user) {
        throw new NotFoundException(EXCEPTION_MESSAGE.USER_NOTFOUND);
      }
      const payload: JwtPayload = { email };
      token = await this.jwtService.sign(payload);
      // const link = `${new ConfigService().get('FRONT_END_HOST')}/reset_password/${token}`;
      const link = `${new ConfigService().get(
        'FRONT_END_HOST',
      )}/reset_password?t=${token}`;
      await sendEmail(
        email,
        'voquangluu997@gmail.com',
        'BOOKS MANAGEMENT RESET PASSWORD',
        `
        <div>Click the link below to reset your password!</div><br/>
        <a href="#">aloalo</a>
        `,
      );
      return {
        message: 'Password reset link has been successfully sent to your mail',
        token,
        email,
      };
    } catch (error) {
      throw new NotFoundException(EXCEPTION_MESSAGE.USER_NOTFOUND);
    }
  }

  async resetPassword(token: string, password: ResetPasswordDto) {
    try {
      const decode = await (this.jwtService as any).decode(token);

      let user = await this.usersRepository.findOne({ email: decode.email });
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);

      user.password = hashPassword;
      await this.usersRepository.save(user);
      return { message: `Reset password successfully` };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Update failed, please try it later',
      );
    }
  }
}
