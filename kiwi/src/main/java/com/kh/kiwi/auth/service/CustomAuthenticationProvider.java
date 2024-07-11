package com.kh.kiwi.auth.service;

import org.springframework.security.authentication.AccountExpiredException;
import org.springframework.security.authentication.CredentialsExpiredException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;

public class CustomAuthenticationProvider extends DaoAuthenticationProvider {

    @Override
    protected void additionalAuthenticationChecks(UserDetails userDetails,
                                                  UsernamePasswordAuthenticationToken authentication)
            throws AuthenticationException {
        super.additionalAuthenticationChecks(userDetails, authentication);

        // 추가 조건: 계정이 잠금 상태인지 확인
        if (!userDetails.isAccountNonLocked()) {
            throw new LockedException("User account is locked");
        }
        System.out.println("CustomAuthenticationProvider isAccountNonLocked check");

        // 추가 조건: 계정이 사용 가능한 상태인지 확인(deleted)
        if (!userDetails.isEnabled()) {
            throw new LockedException("User account is deleted");
        }
        System.out.println("CustomAuthenticationProvider isEnabled check");

        // 추가 조건: 계정이 만료되었는지 확인
//        if (!userDetails.isAccountNonExpired()) {
//            throw new AccountExpiredException("User account is expired");
//        }

        // 추가 조건: 자격 증명(비밀번호)이 만료되었는지 확인
//        if (!userDetails.isCredentialsNonExpired()) {
//            throw new CredentialsExpiredException("User credentials have expired");
//        }
    }
}