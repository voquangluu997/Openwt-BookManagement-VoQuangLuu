package springtraining.luuquangbookmanagement.controllers.book;


import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import springtraining.luuquangbookmanagement.mocks.book.BookMock;
import springtraining.luuquangbookmanagement.repositories.entities.Book;
import springtraining.luuquangbookmanagement.services.BookService;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(BookController.class)
//
//@AutoConfigureMockMvc
//@TestConfiguration
//@MockBean
public class BookControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockBean
    private BookService bookService;

    @Test
    public void getByIdTest() throws Exception {
        final Book book = BookMock.createBook();
        when(bookService.getById(book.getId())).thenReturn(book);
        mvc.perform(MockMvcRequestBuilders.get("/books/" + book.getId())
                .contentType(MediaType.APPLICATION_JSON)).andExpect(status().isOk());
    }
}
