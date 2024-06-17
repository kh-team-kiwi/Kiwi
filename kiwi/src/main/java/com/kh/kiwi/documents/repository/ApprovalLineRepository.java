package com.kh.kiwi.documents.repository;

import com.kh.kiwi.documents.entity.ApprovalLine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApprovalLineRepository extends JpaRepository<ApprovalLine, Long> {
    // 기본적인 CRUD 메서드는 JpaRepository에서 제공됨
}
