import { IsEmail, IsOptional, IsString } from 'class-validator';
export class GetUserProfileDto {
  @IsString()
  id : string;
  
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
