package com.project.onlinevotingsystem.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "elections")
public class Election {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "election_id")
    private Long electionId;

    @Column(name = "election_name", nullable = false)
    private String electionName;

    @Enumerated(EnumType.STRING)
    @Column(name = "election_type")
    private ElectionType electionType;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    @Enumerated(EnumType.STRING)
    private ElectionStatus status = ElectionStatus.DRAFT;

    @Column(name = "result_published")
    private Boolean resultPublished = false;

    @Column(name = "result_published_at")
    private LocalDateTime resultPublishedAt;

    @Column(name = "result_published_by")
    private Long resultPublishedBy;

    @Column(name = "created_by")
    private Long createdBy;
}
