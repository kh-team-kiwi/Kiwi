package com.kh.kiwi.auth.dto;

public interface OAuth2Response {
    //제공자 (Ex. naver, google, ...)
    String getProvider();
    //제공자에서 발급해주는 아이디(번호)
    String getProviderId();
    //사용자 닉네임 / 구글만 실명 (설정한 이름)
    String getName();
    //사용자 프로필 (설정한 프로필)
    String getProfile();
    //사용자 이메일 (설정한 프로필)
    String getEmail();
}
