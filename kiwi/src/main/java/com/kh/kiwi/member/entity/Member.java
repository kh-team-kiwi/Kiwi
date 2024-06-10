package com.kh.kiwi.member.entity;

import com.kh.kiwi.member.dto.SignupDto;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;


@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Table(name="MEMBER")
public class Member implements UserDetails {
    @Id
    private String memberId;
    private String memberPw;
    private String memberFilepath;
    private String memberStatus; // 1:active 2:lock
    private String memberRole; // MEMBER, KADMIN
    private String memberNickname;
    private LocalDateTime memberDate; // created at
    private LocalDateTime expireDate; // 개인정보 보관약정 memberDate+1year

    @Builder
    public Member(String id, String password, String auth){
        this.memberId = id;
        this.memberPw = password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("MEMBER"));
    }

    @Override
    public String getUsername() {
        return memberId;
    }

    @Override
    public String getPassword() {
        return memberPw;
    }

    @Override
    public boolean isAccountNonExpired() {
        // todo
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        // todo
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        // todo
        return true;
    }

    @Override
    public boolean isEnabled() {
        // todo
        return true;
    }

    public Member(SignupDto dto, String hash) {
        this.memberId= dto.getMemberId();
        this.memberPw = hash;
        this.memberFilepath = dto.getMemberFilepath();
        this.memberStatus = "1";
        this.memberRole = "MEMBER";
        this.memberNickname = dto.getMemberNickname();
        this.memberDate = LocalDateTime.now();
        this.expireDate = LocalDateTime.now().plusYears(1);
    }

    public Member(Member member) {
        this.memberId= member.getMemberId();
        this.memberPw = "";
        this.memberFilepath = member.getMemberFilepath();
        this.memberStatus = member.getMemberStatus();
        this.memberRole = member.getMemberRole();
        this.memberNickname = member.getMemberNickname();
        this.memberDate = member.getMemberDate();
        this.expireDate = member.getExpireDate();
    }

}