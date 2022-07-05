package springtraining.luuquangbookmanagement.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import springtraining.luuquangbookmanagement.repositories.entities.Book;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    @Query(value = "SELECT * FROM Book WHERE (title LIKE :search OR author LIKE :search) AND enabled ORDER BY :orderBy",
            nativeQuery = true)
    Page<Book> search(String search, Pageable pageable, String orderBy);

    @Query(value = "SELECT * FROM Book WHERE id = :id AND enabled",
            nativeQuery = true)
    Book findById(long id);

    Book deleteById(long id);

}
