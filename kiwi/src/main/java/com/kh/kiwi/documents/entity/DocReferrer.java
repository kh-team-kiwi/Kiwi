package com.kh.kiwi.documents.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.io.Serializable;

@Data
@Entity
@Table(name = "doc_referrer")
@IdClass(DocReferrerPK.class)
public class DocReferrer {

    @Id
    @Column(name = "DOC_NUM", nullable = false)
    private Long docNum;

    @Id
    @Column(name = "MEMBER_ID", nullable = false)
    private String memberId;

    @Column(name = "EMPLOYEE_NO", nullable = false)
    private String employeeNo;

    @Transient
    private String employeeName;

    @Transient
    private String deptName;

    @Transient
    private String position;
}


@Data
class DocReferrerPK implements Serializable {
    private Long docNum;
    private String memberId;
}
