package com.kh.kiwi.auth.controller;

import com.kh.kiwi.auth.dto.EditMemberDto;
import com.kh.kiwi.auth.dto.LoginDto;
import com.kh.kiwi.auth.dto.ResponseDto;
import com.kh.kiwi.auth.dto.SignupDto;
import com.kh.kiwi.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    //회원가입
    @PostMapping("/api/auth/signup")
    public ResponseDto<?> signup(@RequestBody SignupDto requestBody) {
        ResponseDto<?> result = authService.signup(requestBody);
        return result;
    }
    //프로필정보
    @GetMapping("/api/auth/profile")
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
    @GetMapping("/api/auth/duplicate")
    public ResponseDto<?> duplicate(@RequestBody String memberId) {
        ResponseDto<?> result = authService.duplicate(memberId);
        return result;
    }
}