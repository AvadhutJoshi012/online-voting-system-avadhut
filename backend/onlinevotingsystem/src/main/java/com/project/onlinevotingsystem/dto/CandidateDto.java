package com.project.onlinevotingsystem.dto;

import lombok.Data;

@Data
public class CandidateDto {
    private Long userId;
    private String partyName;
    private String partySymbol;
    private String manifesto;
}
