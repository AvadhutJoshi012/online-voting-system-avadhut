package com.project.onlinevotingsystem.repository;

import com.project.onlinevotingsystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE " +
           "(:query IS NULL OR " +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "CAST(u.userId AS string) LIKE CONCAT('%', :query, '%') OR " +
           "u.idProofNumber LIKE CONCAT('%', :query, '%') OR " +
           "u.panCardNumber LIKE CONCAT('%', :query, '%') OR " +
           "u.passportNumber LIKE CONCAT('%', :query, '%'))")
    List<User> searchUsers(@Param("query") String query);
}
