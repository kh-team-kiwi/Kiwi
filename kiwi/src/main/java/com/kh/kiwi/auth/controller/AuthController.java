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

    /*
    * Register.js
    * 회원가입요청
    * data:
    * {
    *    memberId: '',
    *    memberPwd: '',
    *    confirmPwd: '',
    *    memberFilepath: '',
    *    memberNickname: ''
    * }
    * */
    @PostMapping("/api/auth/signup")
    public ResponseDto<?> signup(@RequestBody SignupDto requestBody) {
        ResponseDto<?> result = authService.signup(requestBody);
        return result;
    }

    /*
     * Register.js
     * 이메일중복검사
     * data:
     * { 'memberId': memberId }
     * */
    @PostMapping("/api/auth/duplicate")
    public ResponseDto<?> duplicate(@RequestBody Map<String,String> requestBody) {
        ResponseDto<?> result = authService.duplicate(requestBody.get("memberId"));
        return result;
    }

    /*
     * AccountSettings.js
     * 프로필 수정
     * */
    @PostMapping("/api/auth/update/account")
    public ResponseDto<?> updateAccount(@RequestParam(value = "profile", required = false) MultipartFile[] files,
                                        @RequestParam("memberId") String memberId,
                                        @RequestParam("memberNickname") String memberNickname) throws IOException {
        return authService.updateAccount(files, memberId, memberNickname);
    }

    // updateAccount 예외처리
    @ExceptionHandler(IOException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseDto<?> handleIOException(IOException e) {
        return ResponseDto.setFailed( "파일 처리 중 오류가 발생했습니다.");
    }

    /*
    * AccountSettings.js
    * password 변경
    * */
    @PutMapping("/api/auth/member/{memberId}")
    public ResponseDto<?> updatePassword(@RequestBody Map<String, String> requestBody, @PathVariable String memberId) {
        String currentPw = requestBody.get("currentPw");
        String newPw = requestBody.get("newPw");
        return authService.updatePassword(memberId,currentPw,newPw);
    }

    /*
    * AccountSettings.js
    * 계정삭제
    * */
    @DeleteMapping("/api/auth/member/{memberId}")
    public ResponseDto<?> deleteAccount(@RequestBody Map<String, String> requestBody, @PathVariable String memberId) {
        String password = requestBody.get("password");
        return authService.deleteAccount(memberId,password);
    }

    /*
     * CreateTeam.js, InviteMember.js
     * 가입 여부 확인
     * */
    @GetMapping("/api/auth/member/{memberId}")
    public ResponseDto<?> existMember(@PathVariable String memberId) {
        ResponseDto<?> result = authService.existMember(memberId);
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




}