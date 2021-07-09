import { GetAuthorsFilterDto } from './dto/get-authors-filter.dto';
import { AuthorService } from './author.service';
import { AuthorDto } from './dto/author.dto';
import { AuthGuard } from '@nestjs/passport';
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
import { Author } from './author.entity';

@Controller('author')
@UseGuards(AuthGuard())
export class AuthorController {
  constructor(private authorService: AuthorService) {}

  @Get()
  getAuthors(@Query() filterDto: GetAuthorsFilterDto): Promise<Author[]> {
    return this.authorService.getAuthors(filterDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Author> {
    return this.authorService.getAuthorById(id);
  }

  @Post()
  createAuthor(
    @Body()
    authorDto: AuthorDto,
  ): Promise<Author> {
    return this.authorService.createAuthor(authorDto);
  }

  @Patch('/:id')
  updateAuthor(
    @Param('id') id: string,
    @Body() authorDto: AuthorDto,
  ): Promise<Author> {
    return this.authorService.updateAuthor(id, authorDto);
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): Promise<void> {
    return this.authorService.deleteAuthor(id);
  }
}
