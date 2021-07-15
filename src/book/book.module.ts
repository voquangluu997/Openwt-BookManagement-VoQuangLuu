import { CategoryModule } from '../category/category.module';
import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book]), AuthModule, CategoryModule],
  providers: [BookService],
  controllers: [BookController],
})
export class BookModule {}
