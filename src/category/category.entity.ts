import { Book } from 'src/book/book.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ default: 'false', name: 'is_deleted' })
  isDeleted: boolean;

  @OneToMany(() => Book, (book) => book.category)
  books: Book[];
}
