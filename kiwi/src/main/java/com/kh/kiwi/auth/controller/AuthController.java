package com.kh.kiwi.auth.controller;

import com.kh.kiwi.auth.dto.*;
import com.kh.kiwi.auth.jwt.JWTUtil;
import com.kh.kiwi.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final JWTUtil jwtUtil;
    private final AuthService authService;

    //회원가입
    @PostMapping("/api/auth/signup")
    public ResponseDto<?> signup(@RequestBody SignupDto requestBody) {
        ResponseDto<?> result = authService.signup(requestBody);
        return result;
    }
    //로그인정보
    @PostMapping("/api/auth/loginfo")
    public ResponseDto<?> loginfo(@RequestHeader("Authorization") String header) {
        String accessToken = header.substring(7); // "Bearer " 이후의 토큰 부분만 추출
        String username = jwtUtil.getUsername(accessToken);
        ResponseDto<?> result = authService.profile(username);
        return result;
    }
    //프로필정보
    @PostMapping("/api/auth/profile")
    public ResponseDto<?> profile(@RequestBody String memberId) {
        ResponseDto<?> result = authService.profile(memberId);
        return result;
    }
    //프로필변경
    @PostMapping("/api/auth/edit")
    public ResponseDto<?> eidt(@RequestBody EditMemberDto memberDto) {
        ResponseDto<?> result = authService.edit(memberDto);
        return result;
    }
    //이메일 중복검사
    @PostMapping("/api/auth/duplicate")
    public ResponseDto<?> duplicate(@RequestBody SignupDto requestBody) {
        ResponseDto<?> result = authService.duplicate(requestBody.getMemberId());
        return result;
    }
}