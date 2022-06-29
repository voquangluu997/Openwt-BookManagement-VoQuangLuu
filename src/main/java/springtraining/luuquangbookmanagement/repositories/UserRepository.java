package springtraining.luuquangbookmanagement.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import springtraining.luuquangbookmanagement.repositories.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}
