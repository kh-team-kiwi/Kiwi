package com.kh.kiwi.documents.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "doc_comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // doc_comments 테이블에 AUTO_INCREMENT 컬럼이 필요합니다. (doc_comments에 추가 필요)

    @ManyToOne
    @JoinColumn(name = "DOC_NUM", nullable = false)
    @ToString.Exclude
    @JsonBackReference
    private Doc doc;

    @Column(name = "DOC_COMMENTS_CONTENT", nullable = false)
    private String content;

    @Column(name = "DOC_COMMENTS_DATE", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "EMPLOYEE_NO", nullable = false)
    private String employeeNo;

    @Transient
    private String employeeName;

    @ManyToOne
    @JoinColumn(name = "EMPLOYEE_NO", insertable = false, updatable = false)
    private MemberDetails employee;
}
