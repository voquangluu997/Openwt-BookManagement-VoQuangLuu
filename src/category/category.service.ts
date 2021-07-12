import { CategoryRepository } from './category.repository';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GetCategoriesFilterDto } from './dto/get-categories-filter.dto';
import { Category } from './category.entity';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryRepository)
    private categoryRepository: CategoryRepository,
  ) {}

  async getCategories(filterDto: GetCategoriesFilterDto): Promise<Category[]> {
    const { search } = filterDto;
    const query = this.categoryRepository.createQueryBuilder('category');
    if (search) {
      query.where(`LOWER(category.name) LIKE LOWER(:search)`, {
        search: `%${search}%`,
      });
    }

    try {
      const categories = query.getMany();
      return categories;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getCategoryById(id: string): Promise<Category> {
    const found = await this.categoryRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return found;
  }

  async createCategory(categoryDto: CategoryDto): Promise<Category> {
    const { name } = CategoryDto;
    const category = this.categoryRepository.create({
      name,
    });
    return await this.categoryRepository.save(category);
  }

  async updateCategory(
    id: string,
    categoryDto: CategoryDto,
  ): Promise<Category> {
    const category = await this.getCategoryById(id);
    category.name = categoryDto.name;
    await this.categoryRepository.save(category);
    return category;
  }

  async deleteCategory(id: string): Promise<void> {
    const result = await this.categoryRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
}
