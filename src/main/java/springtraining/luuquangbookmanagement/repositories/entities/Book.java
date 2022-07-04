package springtraining.luuquangbookmanagement.repositories.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.sun.istack.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "book")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column
     long id;

    @Column
    @NotNull
     String title;

    @Column
    @NotNull
     String author;

    @Column
     String description;

    @Column
     String image;

    @Column
    @NotNull
     Boolean enabled;

    @Column(name = "created_at")
    @CreatedDate
     Date createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
     Date updatedAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties("books")
     private User user;
}
