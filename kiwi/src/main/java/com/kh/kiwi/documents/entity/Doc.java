package com.kh.kiwi.documents.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "doc")
public class Doc {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long docNum;

    @Column(name = "DOC_TITLE", nullable = false)
    private String docTitle;

    @Enumerated(EnumType.STRING)
    private DocStatus docStatus = DocStatus.진행중;

    public enum DocStatus {
        진행중, 완료, 반려
    }

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime docDate = LocalDateTime.now();

    private LocalDateTime docCompletion;

    @Column(columnDefinition = "MEDIUMTEXT")
    private String docContents;

    private String name;
    private LocalDateTime scheduledDeletionDate;
    private String docType;
    private String employeeNo;

    @Column(name = "RETENTION_PERIOD", nullable = false)
    private String retentionPeriod;

    @Column(name = "ACCESS_LEVEL", nullable = false)
    @Enumerated(EnumType.STRING)
    private AccessLevel accessLevel;

    public enum AccessLevel {
        S, A, B, C
    }

    // 결재자 리스트와의 관계 설정
    @OneToMany(mappedBy = "docNum", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ApprovalLine> approvalLines;

    // 참조자 리스트와의 관계 설정
    @OneToMany(mappedBy = "docNum", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<DocReferrer> references;

    @PrePersist
    public void prePersist() {
        if (this.docTitle == null || this.docTitle.trim().isEmpty()) {
            this.docTitle = "기본 제목";
        }
        if (this.docDate == null) {
            this.docDate = LocalDateTime.now();
        }
    }
}
