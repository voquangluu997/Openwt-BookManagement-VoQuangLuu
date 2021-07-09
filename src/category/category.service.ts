import { CategorysRepository } from './category.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { GetCategorysFilterDto } from './dto/get-categorys-filter.dto';
import { Category } from './category.entity';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategorysRepository)
    private categorysRepository: CategorysRepository,
  ) {}

  getCategorys(filterDto: GetCategorysFilterDto): Promise<Category[]> {
    return this.categorysRepository.getCategorys(filterDto);
  }

  async getCategoryById(id: string): Promise<Category> {
    const found = await this.categorysRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return found;
  }

  createCategory(categoryDto: CategoryDto): Promise<Category> {
    return this.categorysRepository.createCategory(categoryDto);
  }

  async updateCategory(
    id: string,
    categoryDto: CategoryDto,
  ): Promise<Category> {
    const category = await this.getCategoryById(id);
    category.name = categoryDto.name;
    await this.categorysRepository.save(category);
    return category;
  }

  async deleteCategory(id: string): Promise<void> {
    const result = await this.categorysRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
}
