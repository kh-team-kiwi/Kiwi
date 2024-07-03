package com.kh.kiwi.documents.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "member_details")
public class MemberDetails {

    @Id
    @Column(name = "EMPLOYEE_NO", length = 350)
    private String employeeNo;

    @Column(name = "NAME", length = 20, nullable = false)
    private String name;

    @Column(name = "GENDER", length = 2)
    private String gender;

    @Column(name = "BIRTH_DATE")
    private LocalDate birthDate;

    @Column(name = "EMP_DATE", nullable = false)
    private LocalDate empDate;

    @Column(name = "QUIT_DATE")
    private LocalDate quitDate;

    @Column(name = "PHONE", length = 15)
    private String phone;

    @Column(name = "ADDRESS", length = 50)
    private String address;

    @Column(name = "DEPT_NAME", length = 50)
    private String deptName;

    @Column(name = "TITLE", length = 10)
    private String title;

    @Column(name = "POSITION", length = 10)
    private String position;

    @Column(name = "DOC_SECURITY", length = 1, nullable = false)
    private int docSecurity; // TINYINT에 맞게 int로 변경

    @Column(name = "DAY_OFF")
    private Integer dayOff;

    @Column(name = "USED_DAY_OFF")
    private Double usedDayOff;

    @Column(name = "COMPANY_NUM", nullable = false)
    private String companyNum;

    @Column(name = "MEMBER_ID", length = 320, nullable = false)
    private String memberId;


}
