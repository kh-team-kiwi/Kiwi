package com.kh.kiwi.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReissueAccessTokenDTO {
    private String accessToken;
    private String refreshToken;
}
