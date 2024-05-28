package com.kh.kiwi.member.entity;

import com.kh.kiwi.member.dto.SignUpDto;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name="MEMBER")
public class Member {
    @Id
    private String memberId;
    private String memberPw;
    private String memberFilepath;
    private String memberStatus; // 1:active 2:lock
    private String memberRole; // MEMBER, KADMIN
    private String memberNickname;
    private LocalDateTime memberDate; // created at
    private LocalDateTime expireDate; // 개인정보 보관약정 memberDate+1year

    public Member(SignUpDto dto) {
        this.memberId= dto.getMemberId();
        this.memberPw = dto.getMemberPw();
        this.memberFilepath = dto.getMemberFilepath();
        this.memberStatus = "1";
        this.memberRole = "MEMBER";
        this.memberNickname = dto.getMemberNickname();
        this.memberDate = LocalDateTime.now();
        this.expireDate = LocalDateTime.now().plusYears(1);
    }
}