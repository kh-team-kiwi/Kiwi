package com.kh.kiwi.auth.dto;

import java.util.Map;

public class GoogleResponse implements OAuth2Response{

    private final Map<String,Object> attribute;

    public GoogleResponse(Map<String, Object> attribute) {
        this.attribute = attribute;
    }

    @Override
    public String getProvider() {
        return "google";
    }

    @Override
    public String getProviderId() {
        return attribute.get("sub").toString();
    }

    @Override
    public String getProfile() {
        return attribute.get("picture").toString();
    }

    @Override
    public String getName() {
        return attribute.get("name").toString();
    }
}