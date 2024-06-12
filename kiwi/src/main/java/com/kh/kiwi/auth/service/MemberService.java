////package com.kh.kiwi.member.service;
////
////import com.kh.kiwi.member.dto.LoginDto;
////import com.kh.kiwi.member.dto.SignUpDto;
////import com.kh.kiwi.member.entity.Member;
////import com.kh.kiwi.member.repository.MemberRepository;
////import lombok.RequiredArgsConstructor;
////import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
////import org.springframework.stereotype.Service;
////
////@RequiredArgsConstructor
////@Service
////public class MemberService {
////    private final MemberRepository memberRepository;
////    private final BCryptPasswordEncoder bCryptPasswordEncoder;
////
////    public String save(SignUpDto dto){
////        return memberRepository.save(Member.builder()
////                .id(dto.getMemberId())
////                .password(bCryptPasswordEncoder.encode(dto.getMemberPw()))
////                .build()).getMemberId();
////    }
////}
//
//
//package com.kh.kiwi.auth.service;
//
//import lombok.extern.slf4j.Slf4j;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.stereotype.Service;
//
//@Service
//@Slf4j
//public class MemberService {
//
//    private static final Logger logger = LoggerFactory.getLogger(MemberService.class);
//
//    public void logMethod() {
//        logger.trace("trace log");
//        logger.debug("debug log");
//        logger.info("info log");
//        logger.warn("warn log");
//        logger.error("error log");
//    }
//    public void login(String username) {
//        logger.info("User {} logged in", username);
//    }
//    public void register(String username, boolean success) {
//        if (success) {
//            logger.info("User {} successfully registered", username);
//        } else {
//            logger.error("User {} registration failed", username);
//        }
//    }
//}