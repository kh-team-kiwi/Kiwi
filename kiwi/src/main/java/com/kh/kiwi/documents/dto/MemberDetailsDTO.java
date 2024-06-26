package com.kh.kiwi.documents.dto;

import com.kh.kiwi.documents.entity.MemberDetails;
import lombok.Data;

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
    private int docSecurity; // TINYINT에 맞게 int로 변경
    private Integer dayOff;
    private Double usedDayOff;
    private int companyNum;
    private String memberId;

    public MemberDetailsDTO() {
        // 기본 생성자
    }

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
}
