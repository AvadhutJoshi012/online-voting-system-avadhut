package com.project.onlinevotingsystem.repository;

import com.project.onlinevotingsystem.entity.Election;
import com.project.onlinevotingsystem.entity.ElectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ElectionRepository extends JpaRepository<Election, Long> {
    List<Election> findByStatus(ElectionStatus status);
}
