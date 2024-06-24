package com.kh.kiwi.documents.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;

@Data
@Entity
@Table(name = "doc_approval")
@IdClass(ApprovalLinePK.class)
public class ApprovalLine {
    @Id
    private Long docNum;

    @Id
    private String docSeq;

    private String employeeNo;
    private int docConf;
    private String docReject;

    // 추가된 필드
    @Transient
    private String employeeName;

    @Transient
    private String deptName;

    @Transient
    private String position;
}

@Data
class ApprovalLinePK implements Serializable {
    private Long docNum;
    private String docSeq;
}