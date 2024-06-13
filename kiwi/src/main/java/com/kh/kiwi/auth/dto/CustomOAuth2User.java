package com.kh.kiwi.auth.dto;

import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

@ToString
public class CustomOAuth2User implements OAuth2User {

    private final UserDTO userDTO;

    public CustomOAuth2User(UserDTO userDTO) {
        System.out.println("CustomOAuth2User : "+userDTO );
        this.userDTO = userDTO;
    }

    @Override
    public Map<String, Object> getAttributes() {
        System.out.println("getAttributes : "+userDTO );
        return null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        System.out.println("getAuthorities : "+userDTO );
        Collection<GrantedAuthority> collection = new ArrayList<>();

        collection.add(new GrantedAuthority() {

            @Override
            public String getAuthority() {

                return userDTO.getRole();
            }
        });

        return collection;
    }

    @Override
    public String getName() {
        System.out.println("getName : "+userDTO );
        return userDTO.getName();
    }

    public String getUsername() {
        System.out.println("getUsername : "+userDTO );
        return userDTO.getUsername();
    }
}