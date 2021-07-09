import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { AuthorsRepository } from './author.repository';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorsRepository]), AuthModule],
  providers: [AuthorService],
  controllers: [AuthorController],
})
export class AuthorModule {}
