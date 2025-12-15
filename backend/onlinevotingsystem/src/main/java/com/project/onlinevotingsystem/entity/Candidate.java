package com.project.onlinevotingsystem.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "candidates", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "election_id"})
})
public class Candidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "candidate_id")
    private Long candidateId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "election_id", nullable = false)
    @JsonBackReference
    private Election election;

    @Column(name = "party_name")
    private String partyName;

    @Column(name = "party_symbol")
    private String partySymbol;

    @Lob
    @Column(name = "candidate_photo", columnDefinition = "LONGBLOB")
    private byte[] candidatePhoto;

    @Lob
    @Column(name = "manifesto", columnDefinition = "TEXT")
    private String manifesto;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
