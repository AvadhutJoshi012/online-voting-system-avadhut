package com.project.onlinevotingsystem.controller;

import com.project.onlinevotingsystem.dto.PublicElectionResultDTO;
import com.project.onlinevotingsystem.service.ElectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/elections")
@RequiredArgsConstructor
public class PublicElectionController {

    private final ElectionService electionService;

    @GetMapping("/results")
    public ResponseEntity<List<PublicElectionResultDTO>> getPublishedResults() {
        return ResponseEntity.ok(electionService.getPublishedElectionResults());
    }
}
