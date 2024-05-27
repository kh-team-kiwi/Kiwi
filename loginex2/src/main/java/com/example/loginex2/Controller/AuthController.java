package com.example.loginex2.Controller;

import com.example.loginex2.Dto.ResponseDto;
import com.example.loginex2.Dto.SignUpDto;
import com.example.loginex2.Entity.Member;
import com.example.loginex2.Repository.MemberRepository;
import com.example.loginex2.Service.AuthService;
import lombok.RequiredArgsConstructor;
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

//    @PostMapping("/login")
//    public ResponseDto<?> login(@RequestBody LoginDto requestBody) {
//        return null;
//    }
}
