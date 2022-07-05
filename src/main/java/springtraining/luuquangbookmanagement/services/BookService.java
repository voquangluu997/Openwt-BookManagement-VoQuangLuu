package springtraining.luuquangbookmanagement.services;

import org.aspectj.weaver.ast.Not;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Service;
import springtraining.luuquangbookmanagement.controllers.book.dto.AddBookRequestDTO;
import springtraining.luuquangbookmanagement.controllers.book.dto.BookFilterDTO;
import springtraining.luuquangbookmanagement.controllers.book.dto.GetBooksResponseDTO;
import springtraining.luuquangbookmanagement.controllers.book.dto.UpdateBookRequestDTO;
import springtraining.luuquangbookmanagement.exceptions.NotFoundException;
import springtraining.luuquangbookmanagement.repositories.BookRepository;
import springtraining.luuquangbookmanagement.repositories.UserRepository;
import springtraining.luuquangbookmanagement.repositories.entities.Book;
import springtraining.luuquangbookmanagement.repositories.entities.User;

import java.util.Date;
import java.util.List;

@Service
public class BookService {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;


    public GetBooksResponseDTO getBooks(BookFilterDTO bookFilter) {
        final int page = bookFilter.getPage();
        final int limit = bookFilter.getLimit();
        Pageable paging = PageRequest.of(page, limit);
        Page<Book> bookPage = bookRepository.search(
                "%" + bookFilter.getSearch() + "%",
                paging,
                bookFilter.getOrderBy());
        System.out.println(bookPage);
        return GetBooksResponseDTO.builder()
                .books(bookPage.getContent())
                .currentPage(bookPage.getNumber())
                .totalItems(bookPage.getTotalElements())
                .totalPages(bookPage.getTotalPages())
                .build();
    }

    public Book getById(long id) throws
            NotFoundException {
        Book book = bookRepository.findById(id);
        if (book != null ) {
            return book;
        }
        throw new NotFoundException("Book ID " + id + " is not found.");
    }

    public Book addBook(AddBookRequestDTO bookRequest) {
        if (!userRepository.existsById(bookRequest.getUserId())) {
            throw new NotFoundException("User not found");
        }
        User user = userRepository.findById(bookRequest.getUserId());
        Book book = convertAddBookDTOToBookEntity(bookRequest);
        book.setUser(user);
        book.setCreatedAt(new Date());
        return bookRepository.save(book);
    }

    @Secured("ADMIN")
    public Book deleteById(long id) throws NotFoundException {
        Book book = bookRepository.findById(id);
        if (book.getEnabled()) {
            return bookRepository.deleteById(id);
        }
        throw new NotFoundException("Book ID " + id + " is not found.");
    }

    public Book update(long id, UpdateBookRequestDTO bookRequest) {
        Book foundBook = bookRepository.findById(id);
        if(foundBook==null){
            throw new NotFoundException("Book with id %ld not found");
        }
        final long userId = bookRequest.getUserId();
        if ((Long) userId != null) {
            if (!userRepository.existsById(bookRequest.getUserId())) {
                throw new NotFoundException("User not found");
            }
        }

        User user = userRepository.findById(bookRequest.getUserId());
        Book book = convertUpdateBookDTOToBookEntity(bookRequest);
        book.setUser(user);
        book.setCreatedAt(new Date());
        return bookRepository.save(book);
    }

    private Book convertAddBookDTOToBookEntity(AddBookRequestDTO bookDTO) {
        return modelMapper.map(bookDTO, Book.class);
    }

    private Book convertUpdateBookDTOToBookEntity(UpdateBookRequestDTO bookDTO) {
        return modelMapper.map(bookDTO, Book.class);
    }
}
