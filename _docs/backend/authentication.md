---
title: "Authentication"
permalink: /docs/backend/authentication/
excerpt: "Authentication and authorization guide"
last_modified_at: 2025-11-15
toc: true
---

# Authentication

## Overview

OVS uses JWT (JSON Web Tokens) for authentication and role-based access control.

## Authentication Flow

1. User submits credentials
2. Server validates credentials
3. Server generates JWT token
4. Client stores token
5. Client includes token in subsequent requests

## JWT Token Structure
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6InZvdGVyIiwiaWF0IjoxNjk4NzYwMDAwLCJleHAiOjE2OTg3NjM2MDB9.
signature
```

## User Roles

- **Admin**: Full system access
- **Voter**: Can view elections and cast votes
- **Candidate**: Can view election results

## Security Implementation
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeRequests()
            .antMatchers("/api/auth/**").permitAll()
            .antMatchers("/api/admin/**").hasRole("ADMIN")
            .anyRequest().authenticated()
            .and()
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
        
        return http.build();
    }
}
```

## Password Security

- Passwords are hashed using BCrypt
- Minimum password length: 8 characters
- Password must contain uppercase, lowercase, and numbers
