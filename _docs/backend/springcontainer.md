---
title: "Spring Container"
permalink: /docs/backend/springcontainer/
excerpt: "Understanding Spring Container in OVS"
last_modified_at: 2025-11-15
toc: true
---

# Spring Container

## Overview

The Online Voting System backend uses Spring Boot and its powerful IoC (Inversion of Control) container for dependency management.

## Application Structure
```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/ovs/
│   │   │       ├── OvsApplication.java
│   │   │       ├── config/
│   │   │       ├── controller/
│   │   │       ├── service/
│   │   │       ├── repository/
│   │   │       ├── model/
│   │   │       └── security/
│   │   └── resources/
│   │       └── application.properties
```

## Main Application Class
```java
@SpringBootApplication
public class OvsApplication {
    public static void main(String[] args) {
        SpringApplication.run(OvsApplication.class, args);
    }
}
```

## Component Scanning

Spring automatically scans and registers beans in the following packages:

- `@Controller` / `@RestController`: Web controllers
- `@Service`: Business logic services
- `@Repository`: Data access layer
- `@Configuration`: Configuration classes

## Dependency Injection Example
```java
@RestController
@RequestMapping("/api/elections")
public class ElectionController {
    
    private final ElectionService electionService;
    
    @Autowired
    public ElectionController(ElectionService electionService) {
        this.electionService = electionService;
    }
    
    @GetMapping
    public List<Election> getAllElections() {
        return electionService.getAllElections();
    }
}
```

## Configuration Classes
```java
@Configuration
public class SecurityConfig {
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // Security configuration
        return http.build();
    }
}
```

## Application Properties
```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/ovs_db
spring.datasource.username=root
spring.datasource.password=password

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# Server Configuration
server.port=8080
```

## Bean Lifecycle

1. **Instantiation**: Spring creates bean instances
2. **Dependency Injection**: Dependencies are injected
3. **Initialization**: `@PostConstruct` methods are called
4. **Ready**: Bean is ready for use
5. **Destruction**: `@PreDestroy` methods are called on shutdown
