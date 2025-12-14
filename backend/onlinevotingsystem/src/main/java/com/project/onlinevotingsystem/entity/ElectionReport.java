package com.project.onlinevotingsystem.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "election_reports")
public class ElectionReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Long reportId;

    @ManyToOne
    @JoinColumn(name = "election_id", nullable = false)
    private Election election;

    @Column(name = "total_registered_voters")
    private Long totalRegisteredVoters;

    @Column(name = "total_votes_cast")
    private Long totalVotesCast;

    @Column(name = "voter_turnout_percentage", precision = 5, scale = 2)
    private BigDecimal voterTurnoutPercentage;

    @Column(name = "total_candidates")
    private Integer totalCandidates;

    @ManyToOne
    @JoinColumn(name = "winning_candidate_id")
    private Candidate winningCandidate;

    @Column(name = "winning_margin")
    private Long winningMargin;

    @Column(name = "report_generated_by")
    private Long reportGeneratedBy;

    @Column(name = "report_generated_at")
    private LocalDateTime reportGeneratedAt;

    @PrePersist
    protected void onCreate() {
        reportGeneratedAt = LocalDateTime.now();
    }
}
