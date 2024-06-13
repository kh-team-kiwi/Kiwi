package com.kh.kiwi.auth.service;

import com.kh.kiwi.auth.dto.*;
import com.kh.kiwi.auth.entity.Member;
import com.kh.kiwi.auth.entity.UserEntity;
import com.kh.kiwi.auth.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        System.out.println("loadUser : "+userRequest );
        OAuth2User oAuth2User = super.loadUser(userRequest);
        System.out.println(oAuth2User);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2Response oAuth2Response = null;
        if (registrationId.equals("naver")) {

            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
        }
        else if (registrationId.equals("google")) {
            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        }
        else if (registrationId.equals("kakao")) {
            oAuth2Response = new KakaoResponse(oAuth2User.getAttributes());
        }
        else {

            return null;
        }

        //리소스 서버에서 발급 받은 정보로 사용자를 특정할 아이디값을 만듬
        String uid = oAuth2Response.getProvider()+" "+oAuth2Response.getProviderId();
        String type = uid.split(" ",2)[0];
       Member existData = memberRepository.findByMemberId(uid);

        if (existData==null) {
            Member member = Member.builder()
                    .memberId(uid)
                    .memberNickname(oAuth2Response.getName())
                    .memberRole("MEMBER")
                    .memberType(type)
                    .build();
            memberRepository.save(member);

            MemberDto memberDto = new MemberDto();
            memberDto.setName(oAuth2Response.getName());
            memberDto.setRole("MEMBER");
            memberDto.setUsername(uid);

            return new CustomOAuth2User(memberDto);
        }
        else {
            existData.setMemberNickname(oAuth2Response.getName());

            memberRepository.save(existData);

            MemberDto memberDto = new MemberDto();
            memberDto.setName(oAuth2Response.getName());
            memberDto.setRole("MEMBER");
            memberDto.setUsername(uid);

            return new CustomOAuth2User(memberDto);
        }

    }
}