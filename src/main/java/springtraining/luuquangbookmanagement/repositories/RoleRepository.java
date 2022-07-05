package springtraining.luuquangbookmanagement.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import springtraining.luuquangbookmanagement.repositories.entities.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {

    @Query(value = "SELECT * FROM role WHERE name = :name",
            nativeQuery = true)
    Role findByName(String name);
}
