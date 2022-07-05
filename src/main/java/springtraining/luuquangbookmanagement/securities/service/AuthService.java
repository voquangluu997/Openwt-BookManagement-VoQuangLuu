package springtraining.luuquangbookmanagement.securities.service;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import springtraining.luuquangbookmanagement.controllers.auth.AuthController;
import springtraining.luuquangbookmanagement.controllers.auth.dto.RegisterRequestDTO;
import springtraining.luuquangbookmanagement.controllers.user.dto.UserResponseDTO;
import springtraining.luuquangbookmanagement.exceptions.BadRequestException;
import springtraining.luuquangbookmanagement.exceptions.NotFoundException;
import springtraining.luuquangbookmanagement.repositories.RoleRepository;
import springtraining.luuquangbookmanagement.repositories.UserRepository;
import springtraining.luuquangbookmanagement.repositories.entities.Role;
import springtraining.luuquangbookmanagement.repositories.entities.User;
import springtraining.luuquangbookmanagement.securities.jwt.TokenManager;

@Service
public class AuthService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private TokenManager tokenManager;

    @Autowired
    private AuthenticationManager authenticationManager;


    public UserResponseDTO login(AuthController.LoginRequestDTO loginRequest) throws Exception {
        User user = userRepository.findByEmail(loginRequest.getEmail());
        if (user == null)
            throw new NotFoundException("User with email " + loginRequest.getEmail() + " not found ");
        final Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
        final String token = tokenManager.generateToken(userDetails);
        return UserResponseDTO.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .token(token)
                .role(user.getRole().getName())
                .build();
    }

    public UserResponseDTO register(RegisterRequestDTO registerRequest) {
        User user = userRepository.findByEmail(registerRequest.getEmail());
        if (user != null) {
            throw new BadRequestException("This email address is already being used");
        }
        user = this.convertRegisterRequestDTOToUserEntity(registerRequest);
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        Role role = roleRepository.findByName("USER");
        user.setRole(role);
        final User savedUser = userRepository.save(user);
        UserDetailsImpl userDetails = userDetailsService.loadUserByUsername(registerRequest.getEmail());
        String jwtToken = tokenManager.generateToken(userDetails);
        return UserResponseDTO.builder().firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(registerRequest.getEmail())
                .avatar(user.getAvatar())
                .avatar(user.getAvatar())
                .token(jwtToken)
                .role(role.getName())
                .build();
    }

    private User convertRegisterRequestDTOToUserEntity(RegisterRequestDTO registerRequestDTO) {
        return modelMapper.map(registerRequestDTO, User.class);
    }

}
