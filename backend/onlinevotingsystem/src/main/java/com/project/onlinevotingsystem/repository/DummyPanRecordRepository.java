package com.project.onlinevotingsystem.repository;

import com.project.onlinevotingsystem.entity.DummyPanRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DummyPanRecordRepository extends JpaRepository<DummyPanRecord, Long> {
}
