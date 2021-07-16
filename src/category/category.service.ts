import { EXCEPTION_MESSAGE, VALIDATE_ERROR } from './../constants/index';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GetCategoriesFilterDto } from './dto/get-categories-filter.dto';
import { Category } from './category.entity';
import { CategoryDto } from './dto/category.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getCategories(filterDto: GetCategoriesFilterDto): Promise<Category[]> {
    const { search } = filterDto;
    const query = this.categoryRepository
      .createQueryBuilder('category')
      .where(`category.isDeleted = :isDeleted`, { isDeleted: false });
    if (search) {
      query.andWhere(`LOWER(category.name) LIKE LOWER(:search)`, {
        search: `%${search}%`,
      });
    }

    try {
      return query.getMany();
    } catch (error) {
      throw new InternalServerErrorException(
        EXCEPTION_MESSAGE.GET_CATEGORIES_FAIL,
      );
    }
  }

  async getCategoryById(id: string): Promise<Category> {
    const found = await this.categoryRepository.findOne({
      id,
      isDeleted: false,
    });
    if (!found) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return found;
  }

  async createCategory(categoryDto: CategoryDto): Promise<Category> {
    const { name } = categoryDto;
    const category = this.categoryRepository.create({
      name,
    });
    try {
      return await this.categoryRepository.save(category);
    } catch (error) {
      if ((error.code = VALIDATE_ERROR.CONFLICT_CODE))
        throw new ConflictException(EXCEPTION_MESSAGE.CATEGORY_CONFLICT);
      throw new InternalServerErrorException(
        EXCEPTION_MESSAGE.CREATE_CATEGORY_FAIL,
      );
    }
  }

  async updateCategory(
    id: string,
    categoryDto: CategoryDto,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      id,
      isDeleted: false,
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return await this.categoryRepository.save({ ...category, ...categoryDto });
  }

  async deleteCategory(id: string): Promise<Category> {
    const result = await this.categoryRepository.findOne({
      id,
      isDeleted: false,
    });
    if (!result) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    result.isDeleted = true;
    return result;
  }
}
