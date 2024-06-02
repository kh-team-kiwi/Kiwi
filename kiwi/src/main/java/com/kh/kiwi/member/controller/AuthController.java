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

//    @PostMapping("/login")
//    public String login(@RequestBody LoginDto loginDto, HttpServletResponse response) {
//        // 로그인 로직 수행
//
//        // Access Token과 Refresh Token 생성 및 저장
//        String accessToken = generateAccessToken();
//        String refreshToken = generateRefreshToken();
//
//        // HTTP-only 쿠키에 Refresh Token 추가
//        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
//        refreshTokenCookie.setHttpOnly(true);
//        refreshTokenCookie.setPath("/"); // 쿠키의 유효 경로 설정
//        response.addCookie(refreshTokenCookie);
//
//        // 로그인 성공 시 리다이렉트 또는 다른 응답 처리
//        return "redirect:/dashboard"; // 대시보드 페이지로 리다이렉트
//    }

}
