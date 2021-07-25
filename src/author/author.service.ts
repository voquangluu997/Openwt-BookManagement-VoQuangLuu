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

  async getAuthors(
    filterDto: GetAuthorsFilterDto,
  ): Promise<{ data: Author[]; pagination: object }> {
    const { search, page, limit, sort } = filterDto;

    const pagination = {
      page: +page || 1,
      limit: +limit || 10,
    };

    const skippedItems = (pagination.page - 1) * pagination.limit;

    const query = this.authorRepository
      .createQueryBuilder('author')
      .where(`author.isDeleted = :isDeleted`, { isDeleted: false });
    if (search) {
      query.andWhere(`LOWER(author.name) LIKE LOWER(:search)`, {
        search: `%${search}%`,
      });
    }

    try {
      let data = await query
        .orderBy('author.name', sort == 'DESC' ? 'DESC' : 'ASC')
        .limit(pagination.limit)
        .offset(skippedItems)
        .getManyAndCount();
      return {
        data: data[0],
        pagination: { ...pagination, totalRows: data[1] },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        EXCEPTION_MESSAGE.GET_AUTHORS_FAIL,
      );
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
    try {
      return await this.authorRepository.save(author);
    } catch (error) {
      throw new InternalServerErrorException(
        EXCEPTION_MESSAGE.CREATE_AUTHOR_FAIL,
      );
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
