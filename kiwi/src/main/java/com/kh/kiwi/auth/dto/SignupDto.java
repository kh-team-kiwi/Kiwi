package com.kh.kiwi.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignupDto {
    private String memberId;
    private String memberPw;
    private String confirmPw;
    private String memberFilepath;
    private String memberNickname;
}