package springtraining.luuquangbookmanagement.mocks.user;

import springtraining.luuquangbookmanagement.repositories.entities.User;

import java.util.UUID;

public class UserMock {

    public static User createUser() {
        return User.builder()
                .email("email")
                .password("password")
                .firstName("firstName")
                .lastName("firstName")

//                .user(
                .build();
    }

}
