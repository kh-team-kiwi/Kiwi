package com.kh.kiwi.auth.controller;

import com.kh.kiwi.auth.dto.LoginDto;
import com.kh.kiwi.auth.dto.ResponseDto;
import com.kh.kiwi.auth.dto.SignupDto;
import com.kh.kiwi.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/api/auth/signup")
    public ResponseDto<?> signup(@RequestBody SignupDto requestBody) {
        ResponseDto<?> result = authService.signup(requestBody);
        return result;
    }
}