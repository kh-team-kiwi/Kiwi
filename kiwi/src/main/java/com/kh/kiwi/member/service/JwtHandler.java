package com.kh.kiwi.member.service;

import com.kh.kiwi.member.repository.TokenRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Map;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class JwtHandler {

    private String type = "Bearer";
    private final TokenRepository tokenRepository;

    /**
     * PrivateClaims으로 토큰 생성
     */
    public String createToken(String key, Map<String, Object> privateClaims, long maxAgeSeconds) {

        Date now = new Date();
        return type + " " + Jwts.builder()
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + maxAgeSeconds * 1000L))
                //Adds all given name/value pairs to the JSON Claims in the payload
                .addClaims(privateClaims) //param: JWT claims to be added to the JWT body :<String memberId, UserRole roleTypes>
                .signWith(SignatureAlgorithm.HS256, key.getBytes())
                .compact();
    }


    public Optional<Claims> checkRefreshToken(String key, String refreshToken, String id) throws Exception {
        String redisRefreshToken = tokenRepository.findTokenByMemberId(id);
        if (!refreshToken.equals(redisRefreshToken)) {
            throw new BadRequestException("토큰 재발급에 실패하였습니다.");
        }
        try {
            return Optional.of(Jwts.parser().setSigningKey(key.getBytes()).parseClaimsJws(untype(refreshToken)).getBody());
        } catch (BadRequestException e) {
            throw new Exception(e);
        }
    }

    public String untype(String token) throws BadRequestException {
        if (token.length() < 6) {
            throw new BadRequestException("토큰을 입력해주세요.");
        }
        return token.substring(type.length());
    }
}