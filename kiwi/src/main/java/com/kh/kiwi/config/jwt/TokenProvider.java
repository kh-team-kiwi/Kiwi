package com.kh.kiwi.config.jwt;

import com.kh.kiwi.member.entity.Member;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.util.Collections;
import java.util.Date;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class TokenProvider {
    private static final String SECURITY_KEY = "thisisaverysecurekeythatis32byteslong";
    private final JwtProperties jwtProperties;

    public String generateToken(Member member, Duration expiredAt) {
        Date now = new Date();
        return makeToken(new Date(now.getTime() + expiredAt.toMillis()), member);
    }

    private String makeToken(Date expiry, Member member) {
        Date now = new Date();
        return Jwts.builder()
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE)
                .setIssuer(jwtProperties.getIssuer())
                .setIssuedAt(now)
                .setExpiration(expiry)
                .setSubject(member.getMemberId())
                .claim("id", member.getMemberId())
                .signWith(SignatureAlgorithm.HS256, jwtProperties.getSecretKey())
                .compact();
    }

    public boolean validToken(String token) {
        try{
            Jwts.parser()
                    .setSigningKey(jwtProperties.getSecretKey())
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Authentication getAuthentication(String token) {
        Claims claims = getClaims(token);
        Set<SimpleGrantedAuthority> authorities = Collections.singleton(new SimpleGrantedAuthority("ROLE_USER"));

        return new UsernamePasswordAuthenticationToken(claims, token, authorities);
    }

    public Long getUserId(String token) {
        Claims claims = getClaims(token);
        return claims.get("id", Long.class);
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(jwtProperties.getSecretKey())
                .parseClaimsJws(token)
                .getBody();
    }

//    // JWT 생성 메서드
//    public String createJwt(String email, int duration) {
//        try {
//            // 현재 시간 기준 1시간 뒤로 만료시간 설정
//            Instant now = Instant.now();
//            Instant exprTime = now.plusSeconds(duration);
//
//            // JWT Claim 설정
//            // *Claim 집합 << 내용 설정 (페이로드 설정)
//            // subject << "sub", issuer << "iss", expiration time << "exp" ....
//            JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
//                    .subject(email)
//                    .issueTime(Date.from(now))
//                    .expirationTime(Date.from(exprTime))
//                    .build();
//
//            // JWT 서명
//            SignedJWT signedJWT = new SignedJWT(
//                    new JWSHeader(JWSAlgorithm.HS256),	// *헤더 설정
//                    claimsSet
//            );
//
//            // HMAC 서명을 사용하여 JWT 서명
//            JWSSigner signer = new MACSigner(SECURITY_KEY.getBytes());	// *서명 설정
//            signedJWT.sign(signer);
//
//            return signedJWT.serialize();
//        } catch (JOSEException e) {
//            e.printStackTrace();
//            return null;
//        }
//    }
//
//    // JWT 검증 메서드
//    public String validateJwt(String token) {
//        try {
//            // 서명 확인을 통한 JWT 검증
//            SignedJWT signedJWT = SignedJWT.parse(token);
//            JWSVerifier verifier = new MACVerifier(SECURITY_KEY.getBytes());
//            if (signedJWT.verify(verifier)) {
//                return signedJWT.getJWTClaimsSet().getSubject();
//            } else {
//                // 서명이 유효하지 않은 경우
//                return null;
//            }
//        } catch (Exception e) {
//            return null;
//        }
//    }

}
