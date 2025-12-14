package com.project.onlinevotingsystem.repository;

import com.project.onlinevotingsystem.entity.ElectionResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ElectionResultRepository extends JpaRepository<ElectionResult, Long> {
    List<ElectionResult> findByElection_ElectionIdOrderByRankPositionAsc(Long electionId);
    Optional<ElectionResult> findByElection_ElectionIdAndCandidate_CandidateId(Long electionId, Long candidateId);
    void deleteByElection_ElectionId(Long electionId);
}
