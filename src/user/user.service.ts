import { UpdatePasswordDto } from './dto/update-password.dto';
import { GetUserProfileDto } from './dto/get-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../auth/user.repository';
import { User } from '../auth/user.entity';
import { EXCEPTION_MESSAGE } from '../constants';
import * as bcrypt from 'bcrypt';
import { VALIDATE_ERROR, SUCCESS_MESSAGE } from '../constants';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
  ) {}

  async getUser(id: string): Promise<GetUserProfileDto> {
    const found = await this.userRepository.findOne({ where: { id } });
    const { firstName, lastName, email, avatar } = found;
    if (!found) {
      throw new NotFoundException(EXCEPTION_MESSAGE.USER_NOTFOUND);
    }
    let userInfo: GetUserProfileDto = {
      id,
      firstName,
      lastName,
      email: found.email,
      avatar: found.avatar,
    };
    return userInfo;
  }

  async getProfile(user: User): Promise<GetUserProfileDto> {
    const { id, firstName, lastName, email, avatar } = user;
    let userInfo: GetUserProfileDto = {
      id,
      firstName,
      lastName,
      email,
      avatar,
    };
    return userInfo;
  }

  async updateUserProfile(
    updateUserProfileDto: UpdateUserProfileDto,
    user: User,
  ): Promise<User> {
    const { firstName, lastName, avatar } = updateUserProfileDto;
    user.firstName = firstName ? firstName : user.firstName;
    user.lastName = lastName ? lastName : user.lastName;
    user.avatar = avatar ? avatar : user.avatar;
    try {
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        'Update failed, please try again later',
      );
    }
  }

  async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
    user: User,
  ): Promise<{ message: string }> {
    const { password, newPassword, confirmNewPassword } = updatePasswordDto;
    if (await bcrypt.compare(password, user.password)) {
      if (newPassword === confirmNewPassword) {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashPassword;
        await this.userRepository.save(user);
        return { message: SUCCESS_MESSAGE.PASSWORD_CONFIRM_SUCCESSFULY };
      } else
        throw new InternalServerErrorException(
          VALIDATE_ERROR.CONFIRM_PASSWORD_FAILED,
        );
    } else
      throw new InternalServerErrorException(VALIDATE_ERROR.PASSWORD_INCORRECT);
  }
}
