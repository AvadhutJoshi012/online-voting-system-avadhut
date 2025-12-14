package com.project.onlinevotingsystem.repository;

import com.project.onlinevotingsystem.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    Optional<Vote> findByElection_ElectionIdAndUser_UserId(Long electionId, Long userId);
    long countByElection_ElectionId(Long electionId);
    long countByCandidate_CandidateId(Long candidateId);
}
