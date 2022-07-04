package springtraining.luuquangbookmanagement.repositories.entities;

import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "\"user\"")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    long id;

    @Column(unique = true)
    @NotNull
    String email;

    @Column
    @NotNull
    String password;

    @Column
    String firstName;

    @Column
    String lastName;

    @Column
    String avatar;

    @NotNull
    @Builder.Default
    @Column(columnDefinition = "boolean default true")
    Boolean enabled = true;

    @OneToMany(mappedBy = "user")
    List<Book> books;

}
