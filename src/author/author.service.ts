import { EXCEPTION_MESSAGE } from './../constants/index';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './author.entity';
import { AuthorDto } from './dto/author.dto';
import { GetAuthorsFilterDto } from './dto/get-authors-filter.dto';
@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  async getAuthors(filterDto: GetAuthorsFilterDto): Promise<Author[]> {
    const { search } = filterDto;
    const query = this.authorRepository
      .createQueryBuilder('author')
      .where(`author.isDeleted = :isDeleted`, { isDeleted: false });
    if (search) {
      query.andWhere(`LOWER(author.name) LIKE LOWER(:search)`, {
        search: `%${search}%`,
      });
    }

    try {
      return query.getMany();
    } catch (error) {
      throw new InternalServerErrorException(EXCEPTION_MESSAGE.GET_AUTHORS_FAIL);
    }
  }

  async getAuthorById(id: string): Promise<Author> {
    const found = await this.authorRepository.findOne({
      id,
      isDeleted: false,
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
    try{
    return await this.authorRepository.save(author);}
    catch(error){
      throw new InternalServerErrorException(EXCEPTION_MESSAGE.CREATE_AUTHOR_FAIL)
    }
  }

  async updateAuthor(id: string, authorDto: AuthorDto): Promise<Author> {
    const author = await this.authorRepository.findOne({
      id,
      isDeleted: false,
    });
    if (!author) {
      throw new NotFoundException(`Author with ID ${id} not found`);
    }
    return await this.authorRepository.save({ ...author, ...authorDto });
  }

  async deleteAuthor(id: string): Promise<Author> {
    const result = await this.authorRepository.findOne({
      id,
      isDeleted: false,
    });
    if (!result) {
      throw new NotFoundException(`Autor with ID ${id} not found`);
    }
    result.isDeleted = true;
    return result;
  }
}
