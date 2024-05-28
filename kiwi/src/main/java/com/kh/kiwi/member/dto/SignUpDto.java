package com.kh.kiwi.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignUpDto {
    private String memberId;
    private String memberPw;
    private String confirmPw;
    private String memberFilepath;
    private String memberNickname;
}
