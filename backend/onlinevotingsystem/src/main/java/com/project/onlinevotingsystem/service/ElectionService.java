package com.project.onlinevotingsystem.service;

import com.project.onlinevotingsystem.dto.CandidateDto;
import com.project.onlinevotingsystem.dto.ElectionCreationRequest;
import com.project.onlinevotingsystem.dto.PublicCandidateResultDTO;
import com.project.onlinevotingsystem.dto.PublicElectionResultDTO;
import com.project.onlinevotingsystem.entity.*;
import com.project.onlinevotingsystem.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ElectionService {

    private final ElectionRepository electionRepository;
    private final CandidateRepository candidateRepository;
    private final ElectionResultRepository electionResultRepository;
    private final ElectionReportRepository electionReportRepository;
    private final VoteRepository voteRepository;
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;

    public List<Election> getAllElections() {
        return electionRepository.findAll();
    }

    public List<Election> getActiveElections() {
        return electionRepository.findByStatus(ElectionStatus.ACTIVE);
    }

    public List<Election> getActiveElectionsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return electionRepository.findByStatus(ElectionStatus.ACTIVE).stream()
                .filter(election -> {
                    if (election.getElectionType() == ElectionType.LOCAL) {
                        return user.getCity() != null && user.getCity().equalsIgnoreCase(election.getCity())
                                && user.getState() != null && user.getState().equalsIgnoreCase(election.getState());
                    } else if (election.getElectionType() == ElectionType.STATE) {
                        return user.getState() != null && user.getState().equalsIgnoreCase(election.getState());
                    }
                    return true; // GENERAL or SPECIAL open to all
                })
                .collect(Collectors.toList());
    }

    public List<Election> getPastElections() {
        return electionRepository.findByStatus(ElectionStatus.COMPLETED);
    }

    public Election getElectionById(Long electionId) {
        return electionRepository.findById(electionId)
                .orElseThrow(() -> new RuntimeException("Election not found"));
    }

    @Transactional
    public Election createElection(ElectionCreationRequest request) {
        Election election = new Election();
        election.setElectionName(request.getElectionName());
        election.setElectionType(request.getElectionType());
        election.setStartDate(request.getStartDate());
        election.setEndDate(request.getEndDate());
        election.setStatus(ElectionStatus.DRAFT);
        election.setCity(request.getCity());
        election.setState(request.getState());

        // Get current admin user
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String adminUsername;
        if (principal instanceof UserDetails) {
            adminUsername = ((UserDetails) principal).getUsername();
        } else {
            adminUsername = principal.toString();
        }

        Admin createdByAdmin = adminRepository.findByEmail(adminUsername)
                .orElseThrow(() -> new RuntimeException("Admin not found with email: " + adminUsername));
        election.setCreatedBy(createdByAdmin.getAdminId());


        Election savedElection = electionRepository.save(election);

        if (request.getCandidates() != null) {
            List<Candidate> candidates = new ArrayList<>();
            for (CandidateDto candDto : request.getCandidates()) {
                User user = userRepository.findById(candDto.getUserId())
                        .orElseThrow(() -> new RuntimeException("User not found with ID: " + candDto.getUserId()));

                Candidate candidate = new Candidate();
                candidate.setElection(savedElection);
                candidate.setUser(user);
                candidate.setPartyName(candDto.getPartyName());
                candidate.setPartySymbol(candDto.getPartySymbol());
                candidate.setManifesto(candDto.getManifesto());
                
                candidates.add(candidateRepository.save(candidate));
            }
            savedElection.setCandidates(candidates);
        }
        return savedElection;
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

        // Use ordered list to avoid deadlocks when updating multiple results in transaction
        List<Candidate> candidates = candidateRepository.findByElection_ElectionIdOrderByCandidateIdAsc(electionId);
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
        report.setReportGeneratedBy(election.getCreatedBy());
        electionReportRepository.save(report);
    }

    public List<ElectionResult> getResults(Long electionId) {
        return electionResultRepository.findByElection_ElectionIdOrderByRankPositionAsc(electionId);
    }

    public ElectionReport getReport(Long electionId) {
        return electionReportRepository.findByElection_ElectionId(electionId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
    }

    @Transactional
    public void updateCandidatePhoto(Long candidateId, byte[] photoData) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        candidate.setCandidatePhoto(photoData);
        candidateRepository.save(candidate);
    }

    public byte[] getCandidatePhoto(Long candidateId) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        return candidate.getCandidatePhoto();
    }

    @Transactional
    public Election toggleResultPublication(Long electionId) {
        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new RuntimeException("Election not found"));

        if (election.getStatus() != ElectionStatus.COMPLETED) {
            throw new RuntimeException("Cannot publish results for incomplete elections");
        }

        election.setResultPublished(!Boolean.TRUE.equals(election.getResultPublished()));
        
        if (election.getResultPublished()) {
            election.setResultPublishedAt(LocalDateTime.now());
            // Get current admin user
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String adminUsername;
            if (principal instanceof UserDetails) {
                adminUsername = ((UserDetails) principal).getUsername();
            } else {
                adminUsername = principal.toString();
            }
            adminRepository.findByEmail(adminUsername).ifPresent(admin -> election.setResultPublishedBy(admin.getAdminId()));
        } else {
            election.setResultPublishedAt(null);
            election.setResultPublishedBy(null);
        }

        return electionRepository.save(election);
    }

    public List<PublicElectionResultDTO> getPublishedElectionResults() {
        List<Election> publishedElections = electionRepository.findAll().stream()
                .filter(e -> Boolean.TRUE.equals(e.getResultPublished()))
                .collect(Collectors.toList());

        List<PublicElectionResultDTO> resultDTOs = new ArrayList<>();

        for (Election election : publishedElections) {
            PublicElectionResultDTO dto = new PublicElectionResultDTO();
            dto.setElectionId(election.getElectionId());
            dto.setElectionName(election.getElectionName());
            dto.setElectionType(election.getElectionType().name());
            dto.setEndDate(election.getEndDate());

            List<ElectionResult> results = electionResultRepository.findByElection_ElectionIdOrderByRankPositionAsc(election.getElectionId());
            
            List<PublicCandidateResultDTO> candidateDTOs = results.stream().map(result -> {
                PublicCandidateResultDTO cDto = new PublicCandidateResultDTO();
                cDto.setCandidateName(result.getCandidate().getUser().getFullName());
                cDto.setPartyName(result.getCandidate().getPartyName());
                cDto.setPartySymbol(result.getCandidate().getPartySymbol());
                cDto.setProfileImageUrl(result.getCandidate().getUser().getProfileImageUrl());
                cDto.setVoteCount(result.getVoteCount());
                cDto.setVotePercentage(result.getVotePercentage());
                cDto.setRankPosition(result.getRankPosition());
                return cDto;
            }).collect(Collectors.toList());

            dto.setResults(candidateDTOs);
            resultDTOs.add(dto);
        }

        return resultDTOs;
    }
}
