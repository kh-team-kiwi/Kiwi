package com.kh.kiwi.documents.repository;

import com.kh.kiwi.documents.entity.Doc;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocRepository extends JpaRepository<Doc, Long> {

    // 필드 이름 변경에 따라 수정
    List<Doc> findByEmployeeNo(String employeeNo);

    // 문서 번호로 문서를 찾는 메서드
    Doc findByDocNum(Long docNum);

}

