import { GetCategorysFilterDto } from './dto/get-categorys-filter.dto';
import { EntityRepository, Repository } from 'typeorm';
import { Category } from './category.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';

@EntityRepository(Category)
export class CategorysRepository extends Repository<Category> {
  async getCategorys(filterDto: GetCategorysFilterDto): Promise<Category[]> {
    const { search } = filterDto;
    const query = this.createQueryBuilder('category');
    if (search) {
      query.where(`LOWER(category.name) LIKE LOWER(:search)`, {
        search: `%${search}%`,
      });
    }

    try {
      const categorys = query.getMany();
      return categorys;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async createCategory(CategoryDto: CategoryDto): Promise<Category> {
    const { name } = CategoryDto;
    const category = this.create({
      name,
    });
    await this.save(category);
    return category;
  }
}
