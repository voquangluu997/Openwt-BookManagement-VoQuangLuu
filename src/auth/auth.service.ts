import {
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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<CreateUserDto> {
    return this.usersRepository.createUser(createUserDto);
  }

  async login(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsDto;
    const user = await this.usersRepository.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { email };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException(EXCEPTION_MESSAGE.UNAUTHORIZED);
    }
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
            'Create accout from GG failed',
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
    if (!email) email = `${user.id}@gmail.com`;

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
      throw new InternalServerErrorException('Query facebook user failed');
    }

    var responseHTML =
      '<html><head><title>Main</title></head><body></body><script>let res = %value%; window.opener.postMessage(res, "*");window.close();</script></html>';
    responseHTML = responseHTML.replace(
      '%value%',
      JSON.stringify({
        userInfo: req.user,
      }),
    );
    return responseHTML;
  }
}
