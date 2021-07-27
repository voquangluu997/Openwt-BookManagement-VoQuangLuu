import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { VALIDATE_ERROR } from '../constants';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, firstName, lastName, avatar } = createUserDto;
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
    return await this.save(user);
    } catch (err) {
      if (err.code === VALIDATE_ERROR.EXISTS_EMAIL_CODE) {
        throw new ConflictException(VALIDATE_ERROR.EMAIL_CONFLICT);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
