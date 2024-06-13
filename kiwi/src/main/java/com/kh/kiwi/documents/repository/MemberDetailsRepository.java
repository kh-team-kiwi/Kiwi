package com.kh.kiwi.documents.repository;

import com.kh.kiwi.documents.entity.MemberDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberDetailsRepository extends JpaRepository<MemberDetails, String> {
}