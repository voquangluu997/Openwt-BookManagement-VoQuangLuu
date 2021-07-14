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
import { Repository } from 'typeorm';
import { VALIDATE_ERROR, EXCEPTION_MESSAGE } from '../constants';
import { Author } from 'src/author/author.entity';
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
    const book = this.bookRepository.create({
      title,
      price,
      publish_year: publishYear,
      description,
      cover,
      author: { id: authorId },
      category: { id: categoryId },
    });
    try {
      return await this.bookRepository.save(book);
    } catch (error) {
      if (error.code == VALIDATE_ERROR.CONFLICT_CODE)
        throw new ConflictException(EXCEPTION_MESSAGE.CONFLICT_BOOK_TITLE);
      throw new InternalServerErrorException();
    }
  }

  async getBooks(filterDto: GetBooksFilterDto): Promise<Book[]> {
    const { search, author, category } = filterDto;
    const query = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author')
      .leftJoinAndSelect('book.category', 'category')
      .where(`book.is_deleted = :isDeleted`, { isDeleted: false });
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
      return query.getMany();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getBookById(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({
      where: { id, is_deleted: false },
      relations: ['author', 'category'],
    });
    if (!book) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return book;
  }

  async updateBook(id: string, bookDto: BookDto): Promise<Book> {
    const book = await this.bookRepository.findOne({
      id,
      is_deleted: false,
    });
    if (!book) {
      throw new NotFoundException(`book with ID ${id} not found`);
    }
    return await this.bookRepository.save({ ...book, ...bookDto });
  }

  async deleteBook(id: string): Promise<Book> {
    const book = await this.bookRepository.findOne({
      id,
      is_deleted: false,
    });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    book.is_deleted = true;
    return await this.bookRepository.save(book);
  }
}
