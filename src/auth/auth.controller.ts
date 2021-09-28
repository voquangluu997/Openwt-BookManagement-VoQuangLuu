import { Repository } from 'typeorm';
import {
  Body,
  Controller,
  forwardRef,
  BadRequestException,
  Post,
  Get,
  Req,
  UseGuards,
  HttpStatus,
  Patch,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { GetUser } from './get-user.decorator';

// import { ForgotPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/register')
  register(@Body() createUserDto: CreateUserDto): Promise<CreateUserDto> {
    return this.authService.register(createUserDto);
  }

  @Post('/login')
  login(@Body() authCredentialsDto: AuthCredentialsDto) {

    return this.authService.login(authCredentialsDto);
  }

  
  @UseGuards(AuthGuard())
  @Post('fn')
  fs(@Body() info, @GetUser() user) {
    return this.authService.fs(info, user);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }
  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req: Request): Promise<any> {
    return this.authService.FBLogin(req);
  }

  @Post('/reset_password')
  sendResetLink(
    @Body('email') email: string,
  ): Promise<{ message: string; token: string; email: string }> {
    return this.authService.sendResetLink(email);
  }

  @Patch('/reset_password/:token')
  resetPassword(
    @Param('token') token: string,
    @Body('password') password: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(token, password);
  }
}
