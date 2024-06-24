package com.kh.kiwi.documents.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "doc_approval")
public class ApprovalLine {

    @EmbeddedId
    private ApprovalLineId id;

    @Column(name = "EMPLOYEE_NO", nullable = false)
    private String employeeNo;

    @Column(name = "DOC_CONF", nullable = false)
    private int docConf;

    @Column(name = "DOC_REJECT")
    private String docReject;

    // 기본 생성자
    public ApprovalLine() {}

    // 매개변수가 있는 생성자
    public ApprovalLine(ApprovalLineId id, String employeeNo, int docConf, String docReject) {
        this.id = id;
        this.employeeNo = employeeNo;
        this.docConf = docConf;
        this.docReject = docReject;
    }

    // Getters and Setters
    public ApprovalLineId getId() {
        return id;
    }

    public void setId(ApprovalLineId id) {
        this.id = id;
    }

    public String getEmployeeNo() {
        return employeeNo;
    }

    public void setEmployeeNo(String employeeNo) {
        this.employeeNo = employeeNo;
    }

    public int getDocConf() {
        return docConf;
    }

    public void setDocConf(int docConf) {
        this.docConf = docConf;
    }

    public String getDocReject() {
        return docReject;
    }

    public void setDocReject(String docReject) {
        this.docReject = docReject;
    }
}
