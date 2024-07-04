package com.kh.kiwi.auth.controller;

import com.kh.kiwi.auth.dto.*;
import com.kh.kiwi.auth.jwt.JWTUtil;
import com.kh.kiwi.auth.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

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

    //이메일 중복검사
    @PostMapping("/api/auth/duplicate")
    public ResponseDto<?> duplicate(@RequestBody SignupDto requestBody) {
        ResponseDto<?> result = authService.duplicate(requestBody.getMemberId());
        return result;
    }

    //가입 여부 확인
    @PostMapping("/api/auth/member")
    public ResponseDto<?> member(@RequestBody SignupDto requestBody) {
        ResponseDto<?> result = authService.member(requestBody.getMemberId());
        return result;
    }

    // Account Settings API요청 : 프로필 이미지, 닉네임
    @PostMapping("/api/auth/update/account")
    public ResponseDto<?> updateAccount(@RequestParam(value = "profile", required = false) MultipartFile[] files,
                                        @RequestParam("memberId") String memberId,
                                        @RequestParam("memberNickname") String memberNickname) throws IOException {
        return authService.updateAccount(files, memberId, memberNickname);
    }

    @ExceptionHandler(IOException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseDto<?> handleIOException(IOException e) {
        return ResponseDto.setFailed( "파일 처리 중 오류가 발생했습니다.");
    }

    // Account Settings API요청 : 계정 삭제
    @PostMapping("/api/auth/update/password")
    public ResponseDto<?> updatePassword(@RequestBody Map<String, String> requestBody) {
        return authService.updatePassword(requestBody);
    }

    // Account Settings API요청 : 계정 삭제
    @PostMapping("/api/auth/delete/account")
    public ResponseDto<?> deleteAccount(@RequestBody Map<String, String> requestBody) {
        return authService.deleteAccount(requestBody);
    }

}