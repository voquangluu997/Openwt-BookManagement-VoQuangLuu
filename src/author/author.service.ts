import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './author.entity';
import { AuthorDto } from './dto/author.dto';
import { AuthorRepository } from './author.repository';
import { GetAuthorsFilterDto } from './dto/get-authors-filter.dto';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(AuthorRepository)
    private authorRepository: AuthorRepository,
  ) {}

  async getAuthors(filterDto: GetAuthorsFilterDto): Promise<Author[]> {
    const { search } = filterDto;
    const query = this.authorRepository.createQueryBuilder('author');
    if (search) {
      query.where(`LOWER(Author.name) LIKE LOWER(:search)`, {
        search: `%${search}%`,
      });
    }

    try {
      const authors = query.getMany();
      return authors;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getAuthorById(id: string): Promise<Author> {
    const found = await this.authorRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return found;
  }

  async createAuthor(authorDto: AuthorDto): Promise<Author> {
    const { name } = authorDto;
    const author = this.authorRepository.create({
      name,
    });
    return await this.authorRepository.save(author);
    // return author;
  }

  async updateAuthor(id: string, authorDto: AuthorDto): Promise<Author> {
    const author = await this.authorRepository.findOne({ where: { id } });
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return await this.authorRepository.save({ ...author, ...authorDto });
  }

  async deleteAuthor(id: string): Promise<void> {
    const result = await this.authorRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Autor with ID ${id} not found`);
    }
  }
}
