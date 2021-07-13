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
    const query = this.authorRepository
      .createQueryBuilder('author')
      .where(`author.is_deleted = :isDeleted`, { isDeleted: false });
    if (search) {
      query.andWhere(`LOWER(author.name) LIKE LOWER(:search)`, {
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
    const found = await this.authorRepository.findOne({
      where: { id, is_deleted: false },
    });
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
  }

  async updateAuthor(id: string, authorDto: AuthorDto): Promise<Author> {
    const author = await this.authorRepository.findOne({
      where: { id, is_deleted: false },
    });
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return await this.authorRepository.save({ ...author, ...authorDto });
  }

  async deleteAuthor(id: string): Promise<Author> {
    const result = await this.authorRepository.findOne({
      id,
      is_deleted: false,
    });
    if (!result) {
      throw new NotFoundException(`Autor with ID ${id} not found`);
    }
    result.is_deleted = true;
    return await this.authorRepository.save(result);
  }
}
