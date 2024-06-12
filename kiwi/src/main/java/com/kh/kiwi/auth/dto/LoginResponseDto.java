package com.kh.kiwi.auth.dto;

import com.kh.kiwi.auth.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@ToString
public class LoginResponseDto {
    private String accessToken;
    private String refreshToken;
    private Member member;
}