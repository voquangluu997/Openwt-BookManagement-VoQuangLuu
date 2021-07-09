import { IsEnum, IsOptional, IsString } from 'class-validator';
export class GetCategorysFilterDto {
  @IsOptional()
  @IsString()
  search?: string;
}
