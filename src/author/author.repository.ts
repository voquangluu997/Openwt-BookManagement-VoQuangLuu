import { GetAuthorsFilterDto } from './dto/get-authors-filter.dto';
import { EntityRepository, Repository } from 'typeorm';
import { Author } from './author.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { AuthorDto } from './dto/author.dto';

@EntityRepository(Author)
export class AuthorsRepository extends Repository<Author> {
  async getAuthors(filterDto: GetAuthorsFilterDto): Promise<Author[]> {
    const { search } = filterDto;
    const query = this.createQueryBuilder('author');
    if (search) {
      query.where(`LOWER(Author.name) LIKE LOWER(:search)`, {
        search: `%${search}%`,
      });
    }

    try {
      const Authors = query.getMany();
      return Authors;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async createAuthor(AuthorDto: AuthorDto): Promise<Author> {
    const { name } = AuthorDto;
    const Author = this.create({
      name,
    });
    await this.save(Author);
    return Author;
  }
}
