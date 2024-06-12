package com.kh.kiwi.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ReissueAccessTokenDTO {
    private String accessToken;
    private String refreshToken;
}
