package com.kh.kiwi.auth.dto;

import lombok.*;
import org.springframework.transaction.annotation.Transactional;

@ToString
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberDto {
    // memberRole
    private String role;
    // memberNickname
    private String name;
    // memberId
    private String username;

    private String filepath;

    public MemberDto(String memberId, String memberNickname, String role) {
    }
}
