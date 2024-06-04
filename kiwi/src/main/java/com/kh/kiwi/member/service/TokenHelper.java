package com.kh.kiwi.member.service;

import com.kh.kiwi.member.entity.Token;
import com.kh.kiwi.member.repository.MemberRepository;
import com.kh.kiwi.member.repository.TokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtHandlerAdapter;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Collections;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TokenHelper {
    private final TokenRepository tokenRepository;

    @Value("${jwt.max.age.access}")
    private Long accessTokenMaxAgeSeconds;
    @Value("${jwt.max.age.refresh}")
    private Long refreshTokenMaxAgeSeconds;
    @Value("${jwt.key.access}")
    private String accessKey;
    @Value("${jwt.key.refresh}")
    private String refreshKey;

    private final JwtHandler jwtHandler;
    private final MemberRepository memberRepository;

    private static final String ROLE_TYPES = "ROLE_TYPES";
    private static final String MEMBER_ID = "MEMBER_ID";


    @Getter
    @AllArgsConstructor
    public static class PrivateClaims {
        private String memberId;
        private String memberRole;
    }

    public static PrivateClaims createPrivateClaims(String memberId, String memberRole) {
        return new PrivateClaims(memberId,memberRole);
    }

    public String createAccessToken(PrivateClaims privateClaims) {
        return jwtHandler.createToken(accessKey,
                Map.of(MEMBER_ID, privateClaims.getMemberId(), ROLE_TYPES, privateClaims.getMemberRole()),
                accessTokenMaxAgeSeconds);
    }

    public String createRefreshToken(PrivateClaims privateClaims, String id) {
        String refreshToken = jwtHandler.createToken(refreshKey,
                Map.of(MEMBER_ID, privateClaims.getMemberId(), ROLE_TYPES, privateClaims.getMemberRole()),
                refreshTokenMaxAgeSeconds);

        tokenRepository.save(new Token(id, refreshToken, Duration.ofDays(refreshTokenMaxAgeSeconds).toString()));
        return refreshToken;
    }

    //토큰 재발급에서 쓰임 - Refresh Token이 유효한지 확인
    public Optional<PrivateClaims> parseRefreshToken(String token, String email) throws Exception {
        return jwtHandler.checkRefreshToken(refreshKey, token, email).map(claims -> convert(claims));
    }

    private PrivateClaims convert(Map<String, Object> claims) {
        return new PrivateClaims(claims.get(MEMBER_ID).toString(), claims.get(ROLE_TYPES).toString());
    }

    public Authentication validateToken(HttpServletRequest request, String token) {
        try {
            Claims claims = null;
            try {
                claims = Jwts.parser()
                        .setSigningKey(accessKey.getBytes(StandardCharsets.UTF_8))
                        .parseClaimsJws(jwtHandler.untype(token))
                        .getBody();
            } catch (BadRequestException e) {
                throw new RuntimeException(e);
            }

            String memberId = claims.get(MEMBER_ID).toString();
            String role = claims.get(ROLE_TYPES).toString();

            User principal = new User(memberId, "", Collections.singletonList(new SimpleGrantedAuthority(role)));
            return new UsernamePasswordAuthenticationToken(principal, token, principal.getAuthorities());
        } catch (JwtException | IllegalArgumentException e) {
            throw new RuntimeException("유효하지 않은 토큰입니다.", e);
        }
    }
}
