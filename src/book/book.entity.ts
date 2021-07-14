import { Author } from 'src/author/author.entity';
import { Category } from 'src/category/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  publish_year: string;

  @Column()
  price: number;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  cover: string;

  // @Column()
  // author_id: string[];
  // @Column()
  // category_id: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @Column({ default: false })
  is_deleted: boolean;

  @ManyToOne(() => Category, (category) => category.books)
  @JoinColumn({ name: 'categry_id' })
  category: Category;

  @ManyToOne(() => Author, (author) => author.books)
  @JoinColumn({ name: 'author_id' })
  author: Author;
}
