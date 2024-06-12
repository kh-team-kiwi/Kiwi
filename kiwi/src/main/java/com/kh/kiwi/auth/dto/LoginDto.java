package com.kh.kiwi.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
@AllArgsConstructor
public class LoginDto {
    @NotBlank
    private String id;
    @NotBlank
    private  String password;
}
