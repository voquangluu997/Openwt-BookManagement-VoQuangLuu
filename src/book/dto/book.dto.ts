import { IsNotEmpty, IsOptional } from 'class-validator';
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
