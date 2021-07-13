import {IsOptional, IsString } from 'class-validator';
export class GetCategoriesFilterDto {
  @IsOptional()
  @IsString()
  search?: string;
}
