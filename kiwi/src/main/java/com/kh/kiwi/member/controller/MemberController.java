//package com.kh.kiwi.member.controller;
//
//import com.kh.kiwi.member.dto.LoginDto;
//import com.kh.kiwi.member.dto.ResponseDto;
//import com.kh.kiwi.member.dto.SignUpDto;
//import com.kh.kiwi.member.service.MemberService;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequiredArgsConstructor
//@RequestMapping("/api/auth")
//public class MemberController {
//    private final MemberService memberService;
//
//    @PostMapping("/signup")
//    public ResponseDto<?> signup(@RequestBody SignUpDto dto) {
//        memberService.save(dto);
//        memberService.login();
//        //ResponseDto<?> result = memberService.save(dto);
//        return null;
//    }
//
////    @PostMapping("/login")
////    public ResponseDto<?> login(@RequestBody LoginDto requestBody) {
////        ResponseDto<?> result = memberService.login(requestBody);
////        return result;
////    }
//
//    @PostMapping("/logout")
//    public ResponseDto<?> login(HttpServletRequest request, HttpServletResponse response) {
//        new SecurityContextLogoutHandler().logout(request, response, SecurityContextHolder.getContext().getAuthentication());
//        //ResponseDto<?> result = memberService.logout(requestBody);
//        return null;
//    }
//}