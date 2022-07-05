package springtraining.luuquangbookmanagement.services.book;

import org.junit.Assert;
import org.junit.Before;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.junit4.SpringRunner;
import springtraining.luuquangbookmanagement.mocks.book.BookMock;
import springtraining.luuquangbookmanagement.repositories.BookRepository;
import springtraining.luuquangbookmanagement.repositories.UserRepository;
import springtraining.luuquangbookmanagement.repositories.entities.Book;
import springtraining.luuquangbookmanagement.services.BookService;

@RunWith(SpringRunner.class)
@ExtendWith(SpringExtension.class)
public class BookServiceTest {
    @TestConfiguration
    public static class BookTestServiceConfiguration {
        @Bean
        BookService bookService() {
            return new BookService();
        }
    }

    @MockBean
    private BookRepository bookRepository;

    @MockBean
    private UserRepository userRepository;

    @Autowired
    private BookService bookService;

    @Before
    public void setUp() {
        Book book = BookMock.createBook();
        Mockito.when(bookRepository.findById(book.getId())).thenReturn(book);
    }

    @Test
    public void getBookByIdSuccess() {
        Book testBook = BookMock.createBook();

        Book foundBook = bookService.getById(testBook.getId());
        Assert.assertEquals(foundBook, testBook);
    }

}
