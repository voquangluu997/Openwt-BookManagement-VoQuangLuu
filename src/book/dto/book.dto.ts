import { IsNotEmpty, IsOptional } from 'class-validator';
import { Author } from 'src/author/author.entity';
import { Category } from 'src/category/category.entity';
export class BookDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  publishYear: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsNotEmpty()
  @IsOptional()
  cover: string;

  @IsNotEmpty()
  categoryId: string;

  @IsNotEmpty()
  authorId: string;
}
