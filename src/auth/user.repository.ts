import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { VALIDATE_ERROR } from '../constants';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<AuthCredentialsDto> {
    const { email, password, firstName, lastName, avatar } = authCredentialsDto;
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);
    const user = this.create({
      email,
      password: hashPassword,
      firstName,
      lastName,
      avatar,
    });

    try {
      await this.save(user);
      return user;
    } catch (err) {
      if (err.code === VALIDATE_ERROR.EXISTS_EMAIL_CODE) {
        throw new ConflictException(VALIDATE_ERROR.EMAIL_CONFLICT);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
