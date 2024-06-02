package com.kh.kiwi.member.dto;

import com.kh.kiwi.member.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDto {
    private String token;
    private int exprTime; // 토큰만료시간
    private Member member;
}