package com.project.onlinevotingsystem.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PublicElectionResultDTO {
    private Long electionId;
    private String electionName;
    private String electionType;
    private LocalDateTime endDate;
    private List<PublicCandidateResultDTO> results;
}
