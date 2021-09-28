import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { GetUserProfileDto } from './dto/get-user-profile.dto';
import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('profiles')
@UseGuards(AuthGuard())
export class UserController {
  constructor(private userService: UserService) {}
  @Get('/:id')
  getUser(@Param('id') id: string): Promise<GetUserProfileDto> {
    return this.userService.getUser(id);
  }

  @Get()
  getProfile( @GetUser() user: User): Promise<GetUserProfileDto> {
    return this.userService.getProfile(user);
  }

  @Patch()
  updateUser(
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @GetUser() user: User,
  ): Promise<UpdateUserProfileDto> {
    return this.userService.updateUserProfile(updateUserProfileDto, user);
  }

  @Patch('/update-password')
  updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @GetUser() user: User,
  ): Promise<{ message: string }> {
    return this.userService.updatePassword(updatePasswordDto, user);
  }

  
}
