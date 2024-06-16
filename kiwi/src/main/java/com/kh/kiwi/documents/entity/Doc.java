package com.kh.kiwi.documents.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "doc")  // 테이블 이름에 맞게 변경
public class Doc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long docNum; // 기존 컬럼에 맞게 필드 이름 수정

    @Enumerated(EnumType.STRING)
    private DocStatus docStatus; // Enum 타입으로 수정

    // Enum 타입 정의
    public enum DocStatus {
        진행중, 완료, 반려
    }

    private String docTitle;
    private LocalDateTime docDate; // LocalDateTime으로 수정
    private LocalDateTime docCompletion; // LocalDateTime으로 수정
    private String docContents;
    private String name; // 사원 이름 추가
    private LocalDateTime scheduledDeletionDate;
    private String docType;
    private String employeeNo; // 작성자 사원 번호
}
