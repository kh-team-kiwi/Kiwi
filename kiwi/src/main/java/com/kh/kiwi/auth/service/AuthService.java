package com.kh.kiwi.auth.service;

import com.kh.kiwi.auth.dto.*;
import com.kh.kiwi.auth.entity.Member;
import com.kh.kiwi.auth.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class AuthService {

    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final MemberRepository memberRepository;

    public ResponseDto<?> signup(SignupDto dto){

        // email(id) 중복 확인
        try {
            // 존재하는 경우 : true / 존재하지 않는 경우 : false
            if(memberRepository.existsById(dto.getMemberId())) {
                return ResponseDto.setFailed("중복된 Email 입니다.");
            }
        } catch (Exception e) {
            return ResponseDto.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        // password 중복 확인
        if(!dto.getMemberPwd().equals(dto.getConfirmPwd())) {
            return ResponseDto.setFailed("비밀번호가 일치하지 않습니다.");
        }

        // 비밀번호 암호화
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPassword = passwordEncoder.encode(dto.getMemberPwd());

        boolean isPasswordMatch = passwordEncoder.matches(dto.getMemberPwd(), hashedPassword);

        if(!isPasswordMatch) {
            return ResponseDto.setFailed("암호화에 실패하였습니다.");
        }

        // UserEntity 생성
        Member member = new Member(dto, hashedPassword);

        // UserRepository를 이용하여 DB에 Entity 저장 (데이터 적재)
        try {
            memberRepository.save(member);
        } catch (Exception e) {
            return ResponseDto.setFailed("데이터베이스 연결에 실패하였습니다.");
        }

        return ResponseDto.setSuccess("회원가입을 성공했습니다.\n로그인 페이지로 이동합니다.");
    }

    public ResponseDto<?> profile(String memberId){
        Member member = memberRepository.findById(memberId).orElse(null);
        if(member != null) {
           MemberDto memberDto = new MemberDto();
           memberDto.setUsername(member.getUsername());
           memberDto.setName(member.getMemberNickname());
           memberDto.setRole(member.getMemberRole());
           memberDto.setFilepath(member.getMemberFilepath());
           return ResponseDto.setSuccessData("프로필 이미지 입니다.", memberDto);
        }
        return  ResponseDto.setFailed("해당하는 프로필 정보가 없습니다.");
    }

    public ResponseDto<?> edit(EditMemberDto memberDto){

        if(memberDto != null) {

        }
        return  ResponseDto.setFailed("생성 불가능한 이메일입니다.");
    }

    public ResponseDto<?> duplicate(String memberId){
        System.out.println(memberId);
        Member member = memberRepository.findById(memberId).orElse(null);
        System.out.println(member);
        if(member == null) {
            return ResponseDto.setSuccess("생성가능한 이메일 입니다.");
        }
        return  ResponseDto.setFailed("생성 불가능한 이메일입니다.");
    }

}
