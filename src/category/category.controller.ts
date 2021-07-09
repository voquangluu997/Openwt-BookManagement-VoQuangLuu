import { GetCategorysFilterDto } from './dto/get-categorys-filter.dto';
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

@Controller('category')
@UseGuards(AuthGuard())
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  getCategorys(@Query() filterDto: GetCategorysFilterDto): Promise<Category[]> {
    return this.categoryService.getCategorys(filterDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Category> {
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
  deleteTask(@Param('id') id: string): Promise<void> {
    return this.categoryService.deleteCategory(id);
  }
}