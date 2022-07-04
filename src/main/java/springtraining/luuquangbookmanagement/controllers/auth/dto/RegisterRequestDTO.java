package springtraining.luuquangbookmanagement.controllers.auth.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;
@Data
public class RegisterRequestDTO {
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    private String firstName;

    private String lastName;

    private String avatar;

}
