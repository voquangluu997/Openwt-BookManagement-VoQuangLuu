package springtraining.luuquangbookmanagement.controllers.book;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import springtraining.luuquangbookmanagement.controllers.book.dto.BookFilterDTO;
import springtraining.luuquangbookmanagement.controllers.book.dto.GetBooksResponseDTO;
import springtraining.luuquangbookmanagement.exceptions.NotFoundException;
import springtraining.luuquangbookmanagement.repositories.entities.Book;
import springtraining.luuquangbookmanagement.services.BookService;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {
    private final BookService bookService;

    @GetMapping
    public GetBooksResponseDTO getBooks(@RequestParam String search, @RequestParam int page, @RequestParam int limit, @RequestParam String orderBy) {
        final BookFilterDTO dto = BookFilterDTO.builder().page(page).search(search).limit(limit).orderBy(orderBy)
                .build();
        return bookService.getBooks(dto);
    }



}
