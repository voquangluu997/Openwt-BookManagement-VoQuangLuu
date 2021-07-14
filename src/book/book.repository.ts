import { BookDto } from './dto/book.dto';
import { EntityRepository, Repository } from 'typeorm';
import { Book } from './book.entity';
@EntityRepository(Book)
export class BooksRepository extends Repository<Book> {
  async addBook(addBookDto: BookDto): Promise<Book> {
    const { title, publishYear, price, description, cover, authorId } =
      addBookDto;
    const book = this.create({
      title,
      price,
      publish_year: publishYear,
      description,
      cover,
      author: { id: authorId },
      // category: { id: category_id },
    });
    return await this.save(book);
  }
}
