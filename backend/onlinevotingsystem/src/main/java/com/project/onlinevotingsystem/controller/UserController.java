package com.project.onlinevotingsystem.controller;

import com.project.onlinevotingsystem.dto.UserUpdateDTO;
import com.project.onlinevotingsystem.entity.User;
import com.project.onlinevotingsystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // Assuming the principal is the User object or details containing the ID
        // Adjust based on your CustomUserDetailsService implementation
        // If CustomUserDetails implements UserDetails and has getUser() method:
        if (auth != null && auth.getPrincipal() instanceof com.project.onlinevotingsystem.service.CustomUserDetailsService.CustomUserDetails) {
             return ((com.project.onlinevotingsystem.service.CustomUserDetailsService.CustomUserDetails) auth.getPrincipal()).getUser().getUserId();
        }
        throw new RuntimeException("User not authenticated");
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(userService.getUserProfile(userId));
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@RequestBody UserUpdateDTO dto) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(userService.updateUserProfile(userId, dto));
    }
}
