package com.kh.kiwi.documents.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ApprovalLineId implements Serializable {

    @Column(name = "DOC_NUM")
    private Long docNum;

    @Column(name = "DOC_SEQ")
    private String docSeq;

    // 기본 생성자
    public ApprovalLineId() {}

    // 매개변수가 있는 생성자
    public ApprovalLineId(Long docNum, String docSeq) {
        this.docNum = docNum;
        this.docSeq = docSeq;
    }

    // Getters and Setters
    public Long getDocNum() {
        return docNum;
    }

    public void setDocNum(Long docNum) {
        this.docNum = docNum;
    }

    public String getDocSeq() {
        return docSeq;
    }

    public void setDocSeq(String docSeq) {
        this.docSeq = docSeq;
    }

    // equals()와 hashCode() 메서드
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ApprovalLineId that = (ApprovalLineId) o;
        return Objects.equals(docNum, that.docNum) && Objects.equals(docSeq, that.docSeq);
    }

    @Override
    public int hashCode() {
        return Objects.hash(docNum, docSeq);
    }
}
