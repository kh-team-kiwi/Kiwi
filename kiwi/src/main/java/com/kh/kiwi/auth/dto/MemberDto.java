package com.kh.kiwi.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberDto {
    // memberRole
    private String role;
    // memberNickname
    private String name;
    // memberId
    private String username;
}
