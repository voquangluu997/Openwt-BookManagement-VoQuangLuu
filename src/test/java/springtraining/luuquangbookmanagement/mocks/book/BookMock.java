package springtraining.luuquangbookmanagement.mocks.book;

import springtraining.luuquangbookmanagement.controllers.book.dto.AddBookRequestDTO;
import springtraining.luuquangbookmanagement.repositories.entities.Book;

import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.function.Supplier;
import java.util.stream.IntStream;

public class BookMock {
    public static Book createBook() {
        return Book.builder()
                .id(1)
                .title(UUID.randomUUID().toString())
                .author(UUID.randomUUID().toString())
                .description(UUID.randomUUID().toString())
                .enabled(true)
                .createdAt(null)
                .updatedAt(null)
//                .user(
                .build();
    }

    public static List<Book> createBooks() {
        return createObjects(BookMock::createBook);
    }

    public static <T> List<T> createObjects(final Supplier<T> creator) {
        return IntStream.range(0, new Random().nextInt(1,10))
                .mapToObj(x -> creator.get())
                .toList();
    }

//    public static AddBookRequestDTO
}
