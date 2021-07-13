import { GetCategoriesFilterDto } from './dto/get-categories-filter.dto';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Category } from './category.entity';

@Controller('categories')
@UseGuards(AuthGuard())
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  getCategorys(@Query() filterDto: GetCategoriesFilterDto): Promise<Category[]> {
    return this.categoryService.getCategories(filterDto);
  }

  @Get('/:id')
  getCategoryById(@Param('id') id: string): Promise<Category> {
    return this.categoryService.getCategoryById(id);
  }

  @Post()
  createCategory(
    @Body()
    CategoryDto: CategoryDto,
  ): Promise<Category> {
    return this.categoryService.createCategory(CategoryDto);
  }

  @Patch('/:id')
  updateCategory(
    @Param('id') id: string,
    @Body() categoryDto: CategoryDto,
  ): Promise<Category> {
    return this.categoryService.updateCategory(id, categoryDto);
  }

  @Delete('/:id')
  deleteCategory(@Param('id') id: string){
    return this.categoryService.deleteCategory(id);
  }
}
