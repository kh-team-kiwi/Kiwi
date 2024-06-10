package com.kh.kiwi.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReissueAccessTokenDTO {
    private String accessToken;
    private String refreshToken;
}
