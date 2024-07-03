package com.kh.kiwi.documents.dto;

import com.kh.kiwi.documents.entity.MemberDetails;
import lombok.*;


import java.time.LocalDate;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class MemberDetailsDTO {

    private String employeeNo;
    private String name;
    private String gender;
    private String birthDate;
    private String empDate;
    private String quitDate;
    private String phone;
    private String address;
    private String deptName;
    private String title;
    private String position;
    private int docSecurity;
    private Integer dayOff;
    private Double usedDayOff;
    private String companyNum;
    private String memberId;

    public MemberDetailsDTO(MemberDetails memberDetails) {
        this.employeeNo = memberDetails.getEmployeeNo();
        this.name = memberDetails.getName();
        this.gender = memberDetails.getGender();
        this.birthDate = memberDetails.getBirthDate() != null ? memberDetails.getBirthDate().toString() : null;
        this.empDate = memberDetails.getEmpDate().toString();
        this.quitDate = memberDetails.getQuitDate() != null ? memberDetails.getQuitDate().toString() : null;
        this.phone = memberDetails.getPhone();
        this.address = memberDetails.getAddress();
        this.deptName = memberDetails.getDeptName();
        this.title = memberDetails.getTitle();
        this.position = memberDetails.getPosition();
        this.docSecurity = memberDetails.getDocSecurity();
        this.dayOff = memberDetails.getDayOff();
        this.usedDayOff = memberDetails.getUsedDayOff();
        this.companyNum = memberDetails.getCompanyNum();
        this.memberId = memberDetails.getMemberId();
    }

    public MemberDetailsDTO(String employeeNo, String name, String gender, LocalDate birthDate, LocalDate empDate, LocalDate quitDate, String phone, String address, String deptName, String title, String position, int docSecurity, Integer dayOff, Double usedDayOff, Integer companyNum, String memberId) {
    }
}
