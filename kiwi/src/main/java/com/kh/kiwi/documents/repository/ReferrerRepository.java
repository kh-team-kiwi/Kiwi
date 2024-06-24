package com.kh.kiwi.documents.repository;

import com.kh.kiwi.documents.entity.DocReferrer;
import com.kh.kiwi.documents.entity.DocReferrerId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReferrerRepository extends JpaRepository<DocReferrer, DocReferrerId> {
    List<DocReferrer> findByDocNum(Long docNum);
}
