package com.project.onlinevotingsystem.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PublicCandidateResultDTO {
    private String candidateName;
    private String partyName;
    private String partySymbol; // Could be URL or text
    private String profileImageUrl;
    private Long voteCount;
    private BigDecimal votePercentage;
    private Integer rankPosition;
}
