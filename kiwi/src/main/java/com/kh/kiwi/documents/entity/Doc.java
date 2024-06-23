package com.kh.kiwi.documents.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "doc")  // 테이블 이름에 맞게 변경
public class Doc {
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime docDate;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long docNum;

    @Enumerated(EnumType.STRING)
    private DocStatus docStatus = DocStatus.진행중; // 기본값 설정

    public enum DocStatus {
        진행중, 완료, 반려
    }

    @Column(name = "DOC_TITLE", nullable = false)
    private String docTitle;

    @PrePersist
    public void prePersist() {
        if (this.docTitle == null || this.docTitle.trim().isEmpty()) {
            this.docTitle = "기본 제목"; // 기본 제목 설정
        }
    }

    private LocalDateTime docCompletion;
    private String docContents;
    private String name;
    private LocalDateTime scheduledDeletionDate;
    private String docType;
    private String employeeNo;
}