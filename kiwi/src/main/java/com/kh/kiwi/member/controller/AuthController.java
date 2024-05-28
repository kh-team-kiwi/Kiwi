package com.kh.kiwi.member.controller;

import com.kh.kiwi.member.dto.LoginDto;
import com.kh.kiwi.member.dto.ResponseDto;
import com.kh.kiwi.member.dto.SignUpDto;
import com.kh.kiwi.member.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")

public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/signUp")
    public ResponseDto<?> signUp(@RequestBody SignUpDto requestBody) {

        System.out.println(requestBody.toString());

        ResponseDto<?> result = authService.signUp(requestBody);
        return result;
    }

    @PostMapping("/login")
    public ResponseDto<?> login(@RequestBody LoginDto requestBody) {
        ResponseDto<?> result = authService.login(requestBody);
        return result;
    }

}
