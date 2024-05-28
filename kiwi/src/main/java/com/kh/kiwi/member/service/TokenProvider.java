package com.kh.kiwi.member.service;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;

@Service
public class TokenProvider {
    private static final String SECURITY_KEY = "thisisaverysecurekeythatis32byteslong";

    // JWT 생성 메서드
    public String createJwt(String email, int duration) {
        try {
            // 현재 시간 기준 1시간 뒤로 만료시간 설정
            Instant now = Instant.now();
            Instant exprTime = now.plusSeconds(duration);

            // JWT Claim 설정
            // *Claim 집합 << 내용 설정 (페이로드 설정)
            // subject << "sub", issuer << "iss", expiration time << "exp" ....
            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                    .subject(email)
                    .issueTime(Date.from(now))
                    .expirationTime(Date.from(exprTime))
                    .build();

            // JWT 서명
            SignedJWT signedJWT = new SignedJWT(
                    new JWSHeader(JWSAlgorithm.HS256),	// *헤더 설정
                    claimsSet
            );

            // HMAC 서명을 사용하여 JWT 서명
            JWSSigner signer = new MACSigner(SECURITY_KEY.getBytes());	// *서명 설정
            signedJWT.sign(signer);

            return signedJWT.serialize();
        } catch (JOSEException e) {
            e.printStackTrace();
            return null;
        }
    }

    // JWT 검증 메서드
    public String validateJwt(String token) {
        try {
            // 서명 확인을 통한 JWT 검증
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(SECURITY_KEY.getBytes());
            if (signedJWT.verify(verifier)) {
                return signedJWT.getJWTClaimsSet().getSubject();
            } else {
                // 서명이 유효하지 않은 경우
                return null;
            }
        } catch (Exception e) {
            return null;
        }
    }
}
