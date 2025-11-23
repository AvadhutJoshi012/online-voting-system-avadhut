package com.project.onlinevotingsystem.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "votes", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"election_id", "user_id"})
})
public class Vote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vote_id")
    private Long voteId;

    @ManyToOne
    @JoinColumn(name = "election_id", nullable = false)
    private Election election;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @Column(name = "vote_hash", unique = true)
    private String voteHash;

    @Column(name = "voted_at")
    private LocalDateTime votedAt;

    @PrePersist
    protected void onCreate() {
        votedAt = LocalDateTime.now();
    }
}
