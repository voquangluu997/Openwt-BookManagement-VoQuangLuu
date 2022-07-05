package springtraining.luuquangbookmanagement.controllers.book.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class UpdateBookRequestDTO {
    private String title;

    private String author;

    private String description;

    private String image;

    private boolean enable;

    private long userId;
}
