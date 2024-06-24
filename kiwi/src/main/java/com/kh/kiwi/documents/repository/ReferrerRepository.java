package com.kh.kiwi.documents.repository;

import com.kh.kiwi.documents.entity.DocReferrer;
import com.kh.kiwi.documents.entity.DocReferrerId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReferrerRepository extends JpaRepository<DocReferrer, DocReferrerId> {
    // 기본적인 CRUD 메서드는 JpaRepository에서 제공됨
}
