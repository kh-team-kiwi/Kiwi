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
    @Column(name = "DOC_NUM", nullable = false)
    private Long docNum;

    @Id
    @Column(name = "DOC_SEQ", nullable = false)
    private String docSeq;

    @Column(name = "EMPLOYEE_NO", nullable = false)
    private String employeeNo;

    @Column(name = "DOC_CONF", nullable = false)
    private int docConf;

    @Column(name = "DOC_REJECT", nullable = true)
    private String docReject;
}

@Data
class ApprovalLinePK implements Serializable {
    private Long docNum;
    private String docSeq;
}
