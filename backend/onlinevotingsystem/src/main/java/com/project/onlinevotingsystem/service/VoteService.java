package com.project.onlinevotingsystem.service;

import com.project.onlinevotingsystem.entity.*;
import com.project.onlinevotingsystem.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.RestTemplate;
import org.springframework.core.io.FileSystemResource;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.Map;
import org.springframework.web.client.HttpClientErrorException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final VoteRepository voteRepository;
    private final VoterElectionStatusRepository voterElectionStatusRepository;
    private final ElectionRepository electionRepository;
    private final UserRepository userRepository;
    private final CandidateRepository candidateRepository;
    private final ElectionService electionService;
    private final RestTemplate restTemplate;

    @Transactional
    public Vote castVote(Long electionId, Long userId, Long candidateId, MultipartFile capturedImage) {
        // Check if election is active
        Election election = electionRepository.findById(electionId)
                .orElseThrow(() -> new RuntimeException("Election not found"));

        if (election.getStatus() != ElectionStatus.ACTIVE) {
            throw new RuntimeException("Election is not active");
        }

        // Check if user has already voted
        Optional<VoterElectionStatus> existingStatusOpt = voterElectionStatusRepository.findByElection_ElectionIdAndUser_UserId(electionId, userId);
        
        if (existingStatusOpt.isPresent() && Boolean.TRUE.equals(existingStatusOpt.get().getHasVoted())) {
            throw new RuntimeException("User has already voted in this election");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify Face
        if (capturedImage != null && !capturedImage.isEmpty()) {
            verifyFace(user, capturedImage);
        } else {
             // Depending on requirements, we might enforce face verification
             throw new RuntimeException("Face verification is required. Please provide a captured image.");
        }

        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        // Create Vote
        Vote vote = new Vote();
        vote.setElection(election);
        vote.setUser(user);
        vote.setCandidate(candidate);
        vote.setVoteHash(UUID.randomUUID().toString());
        
        try {
            vote = voteRepository.save(vote);

            // Update Status
            VoterElectionStatus status;
            if (existingStatusOpt.isPresent()) {
                status = existingStatusOpt.get();
            } else {
                status = new VoterElectionStatus();
                status.setElection(election);
                status.setUser(user);
            }
            status.setHasVoted(true);
            status.setVotedAt(LocalDateTime.now());
            voterElectionStatusRepository.save(status);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            throw new RuntimeException("You have already voted in this election.");
        }

        // Update Election Results
        electionService.calculateResults(electionId);

        return vote;
    }

    private void verifyFace(User user, MultipartFile capturedImage) {
        String profileImageName = user.getProfileImageUrl();
        System.out.println("DEBUG: User ID: " + user.getUserId());
        System.out.println("DEBUG: DB Profile Image Name (Raw): '" + profileImageName + "'");

        if (profileImageName == null || profileImageName.isEmpty()) {
            throw new RuntimeException("User does not have a profile image for verification.");
        }

        // Extract filename if it contains a path (e.g. /api/user/profile/photo/243.png -> 243.png)
        if (profileImageName.contains("/")) {
            profileImageName = profileImageName.substring(profileImageName.lastIndexOf("/") + 1);
        }
        if (profileImageName.contains("\\")) {
            profileImageName = profileImageName.substring(profileImageName.lastIndexOf("\\") + 1);
        }

        System.out.println("DEBUG: Cleaned Profile Image Name: '" + profileImageName + "'");
        System.out.println("DEBUG: Working Directory: " + System.getProperty("user.dir"));

        // Try to find the file in common locations
        File storedImageFile = null;
        
        // 1. Try absolute path based on known structure
        String projectRoot = "C:\\Users\\Yadnyesh Kolte\\online-voting-system"; 
        File absPath = new File(projectRoot + "\\backend\\onlinevotingsystem\\user_uploads\\profiles\\" + profileImageName);
        System.out.println("DEBUG: Checking path 1: " + absPath.getAbsolutePath());
        
        if (absPath.exists()) {
            storedImageFile = absPath;
        } else {
            // 2. Try relative to current working directory (backend/onlinevotingsystem)
            File relPath1 = new File("user_uploads/profiles/" + profileImageName);
            System.out.println("DEBUG: Checking path 2: " + relPath1.getAbsolutePath());
            
            if (relPath1.exists()) {
                storedImageFile = relPath1;
            } else {
                // 3. Try relative one level up (if running from target or similar)
                File relPath2 = new File("../user_uploads/profiles/" + profileImageName);
                System.out.println("DEBUG: Checking path 3: " + relPath2.getAbsolutePath());
                
                if (relPath2.exists()) {
                    storedImageFile = relPath2;
                }
            }
        }

        if (storedImageFile == null || !storedImageFile.exists()) {
            System.out.println("DEBUG: FAILURE - Profile image not found in any checked location.");
            throw new RuntimeException("Stored profile image not found on server. Checked: " + profileImageName);
        }

        System.out.println("DEBUG: SUCCESS - Found profile image at: " + storedImageFile.getAbsolutePath());

        try {
            // Convert MultipartFile to File for RestTemplate
            File tempCapturedFile = File.createTempFile("captured", capturedImage.getOriginalFilename());
            try (FileOutputStream fos = new FileOutputStream(tempCapturedFile)) {
                fos.write(capturedImage.getBytes());
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("storedImage", new FileSystemResource(storedImageFile));
            body.add("capturedImage", new FileSystemResource(tempCapturedFile));

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            String verifyUrl = "http://localhost:5001/verify";
            ResponseEntity<Map> response = restTemplate.postForEntity(verifyUrl, requestEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Boolean isMatch = (Boolean) response.getBody().get("match");
                if (!Boolean.TRUE.equals(isMatch)) {
                    throw new RuntimeException("Face verification failed. Face does not match profile.");
                }
            } else {
                 throw new RuntimeException("Face verification service error.");
            }
            
            // Clean up temp file
            tempCapturedFile.delete();

        } catch (HttpClientErrorException e) {
            try {
                String responseBody = e.getResponseBodyAsString();
                ObjectMapper mapper = new ObjectMapper();
                JsonNode root = mapper.readTree(responseBody);
                if (root.has("error")) {
                    throw new RuntimeException("Face verification failed: " + root.get("error").asText());
                }
            } catch (Exception parseException) {
                // Fallback to default message
            }
            throw new RuntimeException("Face verification failed: " + e.getStatusText());
        } catch (IOException e) {
            throw new RuntimeException("Error processing images for verification.", e);
        } catch (Exception e) {
             throw new RuntimeException("Face verification failed: " + e.getMessage());
        }
    }

    public boolean hasUserVoted(Long electionId, Long userId) {
        return voterElectionStatusRepository.findByElection_ElectionIdAndUser_UserId(electionId, userId)
                .map(status -> Boolean.TRUE.equals(status.getHasVoted()))
                .orElse(false);
    }
}
