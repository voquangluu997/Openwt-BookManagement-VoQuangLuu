import { GetAuthorsFilterDto } from './dto/get-authors-filter.dto';
import { EntityRepository, Repository } from 'typeorm';
import { Author } from './author.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { AuthorDto } from './dto/author.dto';

@EntityRepository(Author)
export class AuthorRepository extends Repository<Author> {}
