package com.kh.kiwi.auth.dto;

import java.util.Map;

public class NaverResponse implements OAuth2Response{

    private final Map<String, Object> attribute;

    public NaverResponse(Map<String, Object> attribute) {

        this.attribute = (Map<String, Object>)attribute.get("response");
    }

    @Override
    public String getProvider() {

        return "naver";
    }

    @Override
    public String getProviderId() {

        return attribute.get("id").toString();
    }

    @Override
    public String getProfile() {

        return attribute.get("profile").toString();
    }

    @Override
    public String getName() {
        if(attribute.get("nickname")!=null) {
        return attribute.get("nickname").toString();
        } else {
            return attribute.get("name").toString();
        }
    }
}