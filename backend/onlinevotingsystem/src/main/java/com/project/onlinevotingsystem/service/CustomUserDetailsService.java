package com.project.onlinevotingsystem.service;

import com.project.onlinevotingsystem.entity.Admin;
import com.project.onlinevotingsystem.entity.User;
import com.project.onlinevotingsystem.repository.AdminRepository;
import com.project.onlinevotingsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Try finding in Admin first
        Optional<Admin> admin = adminRepository.findByEmail(username);
        if (admin.isPresent()) {
            return new org.springframework.security.core.userdetails.User(
                    admin.get().getEmail(),
                    admin.get().getPasswordHash(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
        }

        // Try finding in User
        Optional<User> user = userRepository.findByEmail(username);
        if (user.isPresent()) {
            return new org.springframework.security.core.userdetails.User(
                    user.get().getEmail(),
                    user.get().getPasswordHash(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
            );
        }

        throw new UsernameNotFoundException("User not found with username: " + username);
    }
}
