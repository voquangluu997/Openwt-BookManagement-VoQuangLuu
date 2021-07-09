import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { AuthModule } from './../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategorysRepository } from './category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CategorysRepository]), AuthModule],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
