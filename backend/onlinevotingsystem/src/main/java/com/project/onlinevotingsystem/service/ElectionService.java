package com.project.onlinevotingsystem.service;

import com.project.onlinevotingsystem.entity.*;
import com.project.onlinevotingsystem.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ElectionService {

    private final ElectionRepository electionRepository;
    private final CandidateRepository candidateRepository;
    private final ElectionResultRepository electionResultRepository;
    private final ElectionReportRepository electionReportRepository;
    private final VoteRepository voteRepository;
    private final UserRepository userRepository;

    public List<Election> getAllElections() {
        return electionRepository.findAll();
    }

    public List<Election> getActiveElections() {
        return electionRepository.findByStatus(ElectionStatus.ACTIVE);
    }

    public Election createElection(Election election) {
        return electionRepository.save(election);
    }

    public Election updateElectionStatus(Long electionId, ElectionStatus status) {
        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new RuntimeException("Election not found"));
        election.setStatus(status);
        return electionRepository.save(election);
    }

    public List<Candidate> getCandidatesForElection(Long electionId) {
        return candidateRepository.findByElection_ElectionId(electionId);
    }

    public Candidate addCandidate(Candidate candidate) {
        return candidateRepository.save(candidate);
    }

    @Transactional
    public void calculateResults(Long electionId) {
        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new RuntimeException("Election not found"));

        List<Candidate> candidates = candidateRepository.findByElection_ElectionId(electionId);
        long totalVotes = voteRepository.countByElection_ElectionId(electionId);

        for (Candidate candidate : candidates) {
            long candidateVotes = voteRepository.countByCandidate_CandidateId(candidate.getCandidateId());

            ElectionResult result = electionResultRepository
                    .findByElection_ElectionIdAndCandidate_CandidateId(electionId, candidate.getCandidateId())
                    .orElse(new ElectionResult());

            if (result.getResultId() == null) {
                result.setElection(election);
                result.setCandidate(candidate);
            }
            
            result.setVoteCount(candidateVotes);

            if (totalVotes > 0) {
                 BigDecimal percentage = BigDecimal.valueOf(candidateVotes)
                    .divide(BigDecimal.valueOf(totalVotes), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
                 result.setVotePercentage(percentage);
            } else {
                result.setVotePercentage(BigDecimal.ZERO);
            }

            electionResultRepository.save(result);
        }

        // Update ranks
        List<ElectionResult> results = electionResultRepository.findByElection_ElectionIdOrderByRankPositionAsc(electionId);
        // Sort by vote count desc in memory since we just saved them and JPA might not order by computed field easily in query without custom query
        results.sort((r1, r2) -> r2.getVoteCount().compareTo(r1.getVoteCount()));

        int rank = 1;
        for (ElectionResult result : results) {
            result.setRankPosition(rank++);
            electionResultRepository.save(result);
        }

        // Generate Report
        generateReport(election, totalVotes, candidates.size(), results);
    }

    private void generateReport(Election election, long totalVotes, int totalCandidates, List<ElectionResult> sortedResults) {
        ElectionReport report = electionReportRepository.findByElection_ElectionId(election.getElectionId())
                .orElse(new ElectionReport());

        report.setElection(election);
        report.setTotalVotesCast(totalVotes);
        report.setTotalCandidates(totalCandidates);

        long totalRegistered = userRepository.count(); // Simplified: assumes all users are eligible
        report.setTotalRegisteredVoters(totalRegistered);

        if (totalRegistered > 0) {
            report.setVoterTurnoutPercentage(BigDecimal.valueOf(totalVotes)
                    .divide(BigDecimal.valueOf(totalRegistered), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100)));
        } else {
            report.setVoterTurnoutPercentage(BigDecimal.ZERO);
        }

        if (!sortedResults.isEmpty()) {
            report.setWinningCandidate(sortedResults.get(0).getCandidate());
            long first = sortedResults.get(0).getVoteCount();
            long second = sortedResults.size() > 1 ? sortedResults.get(1).getVoteCount() : 0;
            report.setWinningMargin(first - second);
        }

        report.setReportGeneratedAt(LocalDateTime.now());
        electionReportRepository.save(report);
    }

    public List<ElectionResult> getResults(Long electionId) {
        return electionResultRepository.findByElection_ElectionIdOrderByRankPositionAsc(electionId);
    }

    public ElectionReport getReport(Long electionId) {
        return electionReportRepository.findByElection_ElectionId(electionId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
    }
}
