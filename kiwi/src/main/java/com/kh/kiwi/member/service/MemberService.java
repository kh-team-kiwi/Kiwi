package com.kh.kiwi.member.service;

import com.kh.kiwi.member.dto.LoginDto;
import com.kh.kiwi.member.entity.Member;
import com.kh.kiwi.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class MemberService {
    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public String save(LoginDto dto){
        return memberRepository.save(Member.builder()
                .id(dto.getId())
                .password(bCryptPasswordEncoder.encode(dto.getPassword()))
                .build()).getMemberId();
    }
}
