package com.kh.kiwi.auth.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MemberDto {
    private String role;
    private String name;
    private String username;
    private String filepath;

    // 새로운 생성자 추가
    public MemberDto(String role, String name, String username) {
        this.role = role;
        this.name = name;
        this.username = username;
    }
}
