package com.project.onlinevotingsystem.service;

import com.project.onlinevotingsystem.entity.DummyAadharRecord;
import com.project.onlinevotingsystem.entity.DummyVoterIdRecord;
import com.project.onlinevotingsystem.entity.IdProofType;
import com.project.onlinevotingsystem.repository.DummyAadharRecordRepository;
import com.project.onlinevotingsystem.repository.DummyVoterIdRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VerificationService {

    private final DummyAadharRecordRepository aadharRepository;
    private final DummyVoterIdRecordRepository voterIdRepository;

    public boolean verifyUser(IdProofType type, String number, String fullName, LocalDate dob) {
        if (type == IdProofType.AADHAR) {
            Optional<DummyAadharRecord> record = aadharRepository.findByAadharNumberAndFullNameAndDateOfBirth(
                    number, fullName, dob
            );
            return record.isPresent() && Boolean.TRUE.equals(record.get().getIsValid());
        } else if (type == IdProofType.VOTER_ID) {
            Optional<DummyVoterIdRecord> record = voterIdRepository.findByVoterIdNumberAndFullNameAndDateOfBirth(
                    number, fullName, dob
            );
            return record.isPresent() && Boolean.TRUE.equals(record.get().getIsValid());
        }
        return false;
    }
}
