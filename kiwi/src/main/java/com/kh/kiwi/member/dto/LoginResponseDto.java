package com.kh.kiwi.member.dto;

import com.kh.kiwi.member.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDto {
    private String accessToken;
    private String refreshToken;
    private Member member;
}