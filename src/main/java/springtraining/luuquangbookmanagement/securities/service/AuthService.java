package springtraining.luuquangbookmanagement.securities.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import springtraining.luuquangbookmanagement.controllers.dto.UserResponseDTO;
import springtraining.luuquangbookmanagement.repositories.UserRepository;
import springtraining.luuquangbookmanagement.securities.jwt.TokenManager;

@Service
public class AuthService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    private TokenManager tokenManager;

    @Autowired
    private AuthenticationManager authenticationManager;

    private UserDetailsServiceImpl userDetailsService;


    public UserResponseDTO login(String email, String password) throws Exception {

        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));

        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED");
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS");
        }

        final UserDetailsImpl userDetails = userDetailsService.loadUserByUsername(email);
        final String jwtToken = tokenManager.generateJwtToken(userDetails);
        return UserResponseDTO.builder()
                .firstName("")
                .lastName("")
                .email(email)
                .avatar("")
                .token(jwtToken)
                .build();
    }
}
