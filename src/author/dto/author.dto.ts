import { IsNotEmpty } from 'class-validator';
export class AuthorDto {
  @IsNotEmpty()
  name: string;
}
