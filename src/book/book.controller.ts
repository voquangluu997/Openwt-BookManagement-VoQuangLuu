import { AuthGuard } from '@nestjs/passport';
import { GetBooksFilterDto } from './dto/get-book-filters.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Book } from './book.entity';
import { BookService } from './book.service';
import { BookDto } from './dto/book.dto';

@Controller('books')
// @UseGuards(AuthGuard())
export class BookController {
  constructor(private bookService: BookService) {}

  @Post()
  addBook(@Body() addBookDto: BookDto): Promise<Book> {
    return this.bookService.addBook(addBookDto);
  }

  @Get()
  getBooks(@Query() filterDto: GetBooksFilterDto): Promise<Book[]> {
    return this.bookService.getBooks(filterDto);
  }

  @Get('/:id')
  getBookById(@Param('id') id: string): Promise<Book> {
    return this.bookService.getBookById(id);
  }

  @Patch('/:id')
  updateBook(@Param('id') id: string, @Body() bookDto: BookDto): Promise<Book> {
    return this.bookService.updateBook(id, bookDto);
  }

  @Delete('/:id')
  deleteBook(@Param('id') id: string): Promise<Book> {
    return this.bookService.deleteBook(id);
  }
}
