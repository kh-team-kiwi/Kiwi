package com.kh.kiwi.auth.dto;

import com.kh.kiwi.auth.entity.Member;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;
@ToString
public class CustomOAuth2User implements OAuth2User {

    private final MemberDto memberDto;

    public CustomOAuth2User(MemberDto memberDto) {
        System.out.println("CustomOAuth2User : "+memberDto );
        this.memberDto = memberDto;
    }

    @Override
    public Map<String, Object> getAttributes() {
        System.out.println("getAttributes : "+memberDto );
        return null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        System.out.println("getAuthorities : "+memberDto.getRole() );
        Collection<GrantedAuthority> collection = new ArrayList<>();

        collection.add(new GrantedAuthority() {

            @Override
            public String getAuthority() {

                return memberDto.getRole();
            }
        });

        return collection;
    }

    @Override
    public String getName() {
        System.out.println("getName : "+memberDto.getName() );
        return memberDto.getName();
    }

    public String getMemberId() {
        System.out.println("getUsername : "+memberDto.getUsername() );
        return memberDto.getUsername();
    }
}