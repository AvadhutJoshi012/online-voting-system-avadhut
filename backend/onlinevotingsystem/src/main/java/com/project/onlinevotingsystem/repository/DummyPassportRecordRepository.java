package com.project.onlinevotingsystem.repository;

import com.project.onlinevotingsystem.entity.DummyPassportRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DummyPassportRecordRepository extends JpaRepository<DummyPassportRecord, Long> {
}
