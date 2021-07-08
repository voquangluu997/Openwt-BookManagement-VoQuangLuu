import { GetUserProfileDto } from './dto/get-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersRepository } from '../auth/user.repository';
import { User } from '../auth/user.entity';
import { EXCEPTION_MESSAGE } from '../constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersRepository)
    private userRepository: UsersRepository,
  ) {}

  async getUser(id: string): Promise<GetUserProfileDto> {
    const found = await this.userRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(EXCEPTION_MESSAGE.USER_NOTFOUND);
    }
    const { email, firstName, lastName, avatar } = found;
    return { id, email, firstName, lastName, avatar };
  }

  async updateUserProfile(
    updateUserProfileDto: UpdateUserProfileDto,
    user: User,
  ): Promise<User> {
    const { firstName, lastName, avatar } = updateUserProfileDto;
    user.firstName = firstName ? firstName : user.firstName;
    user.lastName = lastName ? lastName : user.lastName;
    user.avatar = avatar ? avatar : user.avatar;
    await this.userRepository.save(user);
    return user;
  }
}
