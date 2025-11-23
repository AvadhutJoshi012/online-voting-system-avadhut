package com.project.onlinevotingsystem.repository;

import com.project.onlinevotingsystem.entity.ElectionResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ElectionResultRepository extends JpaRepository<ElectionResult, Long> {
    List<ElectionResult> findByElection_ElectionIdOrderByRankPositionAsc(Long electionId);
    void deleteByElection_ElectionId(Long electionId);
}
