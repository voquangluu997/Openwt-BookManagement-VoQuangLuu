import { GetCategoriesFilterDto } from './dto/get-categories-filter.dto';
import { EntityRepository, Repository } from 'typeorm';
import { Category } from './category.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
 
}
