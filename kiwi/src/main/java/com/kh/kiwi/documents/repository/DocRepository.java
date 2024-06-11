package com.kh.kiwi.documents.repository;

import com.kh.kiwi.documents.entity.Doc;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocRepository extends JpaRepository<Doc, Long> {
    List<Doc> findByCreComEmpNum(String creComEmpNum);
}
