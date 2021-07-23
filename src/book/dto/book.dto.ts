import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
export class BookDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  publishYear: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
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
