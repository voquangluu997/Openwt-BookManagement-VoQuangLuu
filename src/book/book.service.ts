import { Category } from 'src/category/category.entity';
import { GetBooksFilterDto } from './dto/get-book-filters.dto';
import { BookDto } from './dto/book.dto';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { getConnection, Repository } from 'typeorm';
import { VALIDATE_ERROR, EXCEPTION_MESSAGE } from '../constants';
import { Author } from 'src/author/author.entity';

export interface Ipagination {
  page: number;
  limit: number;
}
@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async addBook(addBookDto: BookDto): Promise<Book> {
    const {
      title,
      publishYear,
      price,
      description,
      cover,
      authorId,
      categoryId,
    } = addBookDto;

    try {
      var author = await getConnection()
        .getRepository(Author)
        .createQueryBuilder('author')
        .where('author.id = :authorId', { authorId })
        .getOne();
    } catch (error) {
      throw new InternalServerErrorException(EXCEPTION_MESSAGE.QUERY_FAIL);
    }

    try {
      var category = await getConnection()
        .getRepository(Category)
        .createQueryBuilder('category')
        .where('category.id = :categoryId', {
          categoryId,
        })
        .getOne();
    } catch (error) {
      throw new InternalServerErrorException(EXCEPTION_MESSAGE.QUERY_FAIL);
    }

    if (!author)
      throw new NotFoundException(EXCEPTION_MESSAGE.AUTHOR_NOT_FOUND);
    if (!category)
      throw new NotFoundException(EXCEPTION_MESSAGE.CATEGORY_NOT_FOUND);

    const book = this.bookRepository.create({
      title,
      price,
      publishYear,
      description,
      cover,
      author,
      category,
    });

    try {
      return await this.bookRepository.save({ ...book, author, category });
    } catch (error) {
      if (error.code == VALIDATE_ERROR.CONFLICT_CODE)
        throw new ConflictException(EXCEPTION_MESSAGE.BOOK_CONFLICT);
      throw new InternalServerErrorException(
        EXCEPTION_MESSAGE.CREATE_BOOK_FAIL,
      );
    }
  }

  async getBooks(filterDto: GetBooksFilterDto): Promise<any> {
    const { search, author, category, page, limit, sort } = filterDto;
    const pagination = {
      page: page || 1,
      limit: limit || 10,
    };

    const skippedItems = (pagination.page - 1) * pagination.limit;
    const query = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author')
      .leftJoinAndSelect('book.category', 'category')
      .where(`book.isDeleted = :isDeleted`, { isDeleted: false });

    if (search) {
      query.andWhere(
        '(LOWER(book.title) LIKE LOWER(:search) OR LOWER(book.publishYear) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    if (author) {
      query.andWhere(`author.name LIKE :author`, {
        author: `%${author}%`,
      });
    }

    if (category) {
      query.andWhere(`category.name LIKE :category`, {
        category: `%${category}%`,
      });
    }

    try {
      let data = await query
        .orderBy('book.title', sort == 'DESC' ? 'DESC' : 'ASC')
        .limit(pagination.limit)
        .offset(skippedItems)
        .getManyAndCount();

      return {
        data: data[0],
        pagination: { ...pagination, totalRows: data[1] },
      };
    } catch (error) {
      throw new InternalServerErrorException(EXCEPTION_MESSAGE.GET_BOOKS_FAIL);
    }
  }

  async getBookById(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['author', 'category'],
    });
    if (!book) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return book;
  }

  async updateBook(id: string, bookDto: BookDto): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
      relations: ['author', 'category'],
    });

    try {
      var author = await getConnection()
        .getRepository(Author)
        .createQueryBuilder('author')
        .where('author.id = :authorId', { authorId: bookDto.authorId })
        .getOne();
    } catch (error) {
      throw new InternalServerErrorException(EXCEPTION_MESSAGE.QUERY_FAIL);
    }

    try {
      var category = await getConnection()
        .getRepository(Category)
        .createQueryBuilder('category')
        .where('category.id = :categoryId', {
          categoryId: bookDto.categoryId,
        })
        .getOne();
    } catch (error) {
      throw new InternalServerErrorException(EXCEPTION_MESSAGE.QUERY_FAIL);
    }

    if (!author)
      throw new NotFoundException(EXCEPTION_MESSAGE.AUTHOR_NOT_FOUND);
    if (!category)
      throw new NotFoundException(EXCEPTION_MESSAGE.CATEGORY_NOT_FOUND);
    if (!book) {
      throw new NotFoundException(EXCEPTION_MESSAGE.BOOK_NOT_FOUND);
    }
    return await this.bookRepository.save({
      ...book,
      ...bookDto,
      author,
      category,
    });
  }

  async deleteBook(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({
      id,
      isDeleted: false,
    });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    book.isDeleted = true;
    return book;
  }
}
