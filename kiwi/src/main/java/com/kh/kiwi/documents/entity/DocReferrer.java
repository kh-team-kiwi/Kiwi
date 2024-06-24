package com.kh.kiwi.documents.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "doc_referrer")
@IdClass(DocReferrerId.class) // 복합 키를 위한 IdClass 사용
public class DocReferrer {

    @Id
    @Column(name = "DOC_NUM")
    private Long docNum;

    @Id
    @Column(name = "COMPANY_NUM")
    private Long companyNum;

    @Id
    @Column(name = "MEMBER_ID")
    private String memberId;

    @Column(name = "EMPLOYEE_NO")
    private String employeeNo;
}
