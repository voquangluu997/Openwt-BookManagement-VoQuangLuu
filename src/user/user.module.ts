import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from '../auth/user.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository]), AuthModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
