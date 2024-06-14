package com.kh.kiwi.documents.repository;

import com.kh.kiwi.documents.entity.MemberDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberDetailsRepository extends JpaRepository<MemberDetails, String> {

    MemberDetails findByEmployeeNo(String employeeNo);

    List<MemberDetails> findByCompanyNum(int companyNum);

    List<MemberDetails> findByMemberId(String memberId);

    List<MemberDetails> findByNameContaining(String name);

    List<MemberDetails> findByDeptNameContaining(String deptName);

    List<MemberDetails> findByTitleContaining(String title);

    List<MemberDetails> findByPositionContaining(String position);

    void deleteByEmployeeNo(String employeeNo);
}
