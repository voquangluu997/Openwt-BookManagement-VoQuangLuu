import { IsOptional, IsString } from 'class-validator';
export class GetAuthorsFilterDto {
  @IsOptional()
  @IsString()
  search?: string;
}
