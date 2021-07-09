import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './author.entity';
import { AuthorDto } from './dto/author.dto';
import { AuthorsRepository } from './author.repository';
import { GetAuthorsFilterDto } from './dto/get-authors-filter.dto';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(AuthorsRepository)
    private authorsRepository: AuthorsRepository,
  ) {}

  getAuthors(filterDto: GetAuthorsFilterDto): Promise<Author[]> {
    return this.authorsRepository.getAuthors(filterDto);
  }

  async getAuthorById(id: string): Promise<Author> {
    const found = await this.authorsRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return found;
  }

  createAuthor(authorDto: AuthorDto): Promise<Author> {
    return this.authorsRepository.createAuthor(authorDto);
  }

  async updateAuthor(id: string, authorDto: AuthorDto): Promise<Author> {
    const author = await this.getAuthorById(id);
    author.name = authorDto.name;
    await this.authorsRepository.save(author);
    return author;
  }

  async deleteAuthor(id: string): Promise<void> {
    const result = await this.authorsRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Autor with ID ${id} not found`);
    }
  }
}
