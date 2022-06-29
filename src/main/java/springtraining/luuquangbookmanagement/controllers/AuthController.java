package springtraining.luuquangbookmanagement.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import springtraining.luuquangbookmanagement.controllers.dto.LoginRequestDTO;
import springtraining.luuquangbookmanagement.controllers.dto.UserResponseDTO;
import springtraining.luuquangbookmanagement.securities.service.AuthService;

import javax.validation.Valid;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public UserResponseDTO login(@Valid @RequestBody LoginRequestDTO loginRequest) throws Exception {
        return authService.login(loginRequest.getEmail(), loginRequest.getPassword());
    }


}
