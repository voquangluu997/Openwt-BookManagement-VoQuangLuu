import { Type } from 'class-transformer';
import {IsNumber, IsOptional, IsString, Min } from 'class-validator';
export class GetCategoriesFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsString()
  sort?: string;
}
