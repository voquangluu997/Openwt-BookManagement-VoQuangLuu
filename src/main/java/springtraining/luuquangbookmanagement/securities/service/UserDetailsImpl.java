package springtraining.luuquangbookmanagement.securities.service;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import springtraining.luuquangbookmanagement.repositories.entities.User;

import java.util.*;

public class UserDetailsImpl implements UserDetails {

    private static final long serialVersionUID = 1L;

    private long id;

    private String username;

    @JsonIgnore
    private String password;

    private boolean isEnabled;

    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl(long id, String username, String password, boolean isEnabled
//                           Collection<? extends GrantedAuthority> authorities
    ) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.isEnabled = isEnabled;
//        this.authorities = authorities;
    }

    public static UserDetailsImpl build(User user) {
//        List<GrantedAuthority> authorities = new ArrayList<>(Collections.singletonList(
//                new SimpleGrantedAuthority(user.getRole().getName())));

        return new UserDetailsImpl(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                user.getEnabled()
//                authorities
        );
    }

    public long getId() {
        return id;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isEnabled;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }


}
