package springtraining.luuquangbookmanagement.controllers.book.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class AddBookRequestDTO {
    @NotBlank
    private String title;

    @NotBlank
    private String author;

    private String description;

    private String image;

    @NotBlank
    private long userId;
}
