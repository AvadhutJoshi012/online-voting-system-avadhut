package com.project.onlinevotingsystem.dto;

import com.project.onlinevotingsystem.entity.ElectionType;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ElectionCreationRequest {
    private String electionName;
    private ElectionType electionType;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private List<CandidateDto> candidates;
}
