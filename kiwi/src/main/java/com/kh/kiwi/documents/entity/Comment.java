package com.kh.kiwi.documents.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "doc_comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // doc_comments 테이블에 AUTO_INCREMENT 컬럼이 필요합니다. (doc_comments에 추가 필요)

    @ManyToOne
    @JoinColumn(name = "DOC_NUM", nullable = false)
    private Doc doc;

    @Column(name = "DOC_COMMENTS_CONTENT", nullable = false)
    private String content;

    @Column(name = "DOC_COMMENTS_DATE", nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "EMPLOYEE_NO", nullable = false)
    private MemberDetails employee;

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Doc getDoc() {
        return doc;
    }

    public void setDoc(Doc doc) {
        this.doc = doc;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public MemberDetails getEmployee() {
        return employee;
    }

    public void setEmployee(MemberDetails employee) {
        this.employee = employee;
    }
}
