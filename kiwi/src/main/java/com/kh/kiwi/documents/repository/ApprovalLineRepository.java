package com.kh.kiwi.documents.repository;

import com.kh.kiwi.documents.entity.ApprovalLine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApprovalLineRepository extends JpaRepository<ApprovalLine, Long> {
    List<ApprovalLine> findByDocNum(Long docNum);
}
