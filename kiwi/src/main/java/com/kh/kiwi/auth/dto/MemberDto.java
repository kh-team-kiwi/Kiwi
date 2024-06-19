package com.kh.kiwi.auth.dto;

import lombok.*;

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
}
