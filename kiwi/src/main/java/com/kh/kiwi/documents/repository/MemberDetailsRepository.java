package com.kh.kiwi.documents.repository;

import com.kh.kiwi.documents.entity.MemberDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberDetailsRepository extends JpaRepository<MemberDetails, String> {

    // 사원번호로 MemberDetails 조회
    MemberDetails findByEmployeeNo(String employeeNo);

    // 회사번호로 MemberDetails 목록 조회
    List<MemberDetails> findByCompanyNum(int companyNum);

    // 회원아이디로 MemberDetails 목록 조회
    List<MemberDetails> findByMemberId(String memberId);

    // 사원이름으로 MemberDetails 목록 조회 (Like 검색)
    List<MemberDetails> findByNameContaining(String name);

    // 부서이름으로 MemberDetails 목록 조회 (Like 검색)
    List<MemberDetails> findByDeptNameContaining(String deptName);

    // 직위로 MemberDetails 목록 조회 (Like 검색)
    List<MemberDetails> findByTitleContaining(String title);

    // 직책으로 MemberDetails 목록 조회 (Like 검색)
    List<MemberDetails> findByPositionContaining(String position);

    // 사원번호로 MemberDetails 삭제
    void deleteByEmployeeNo(String employeeNo);
}