package com.kh.kiwi.config.jwt;

import com.kh.kiwi.member.entity.Member;
import com.kh.kiwi.member.repository.MemberRepository;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.Duration;
import java.util.Date;

@SpringBootTest
public class TokenProviderTest {
    @Autowired
    private TokenProvider tokenProvider;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private JwtProperties jwtProperties;


    @DisplayName("generateToken(): 유저 정보와 만료 기간을 정달해 토큰을 만들 수 있다.")
    @Test
    void generateToken() {
        Member testMember = memberRepository.save(Member.builder()
                .id("user@gamil.com").password("test").build());

        String token = tokenProvider.generateToken(testMember, Duration.ofDays(14));

        String memberId = Jwts.parser().setSigningKey(jwtProperties.getSecretKey())
                .parseClaimsJws(token)
                .getBody()
                .get("id", String.class);

        //assertThat(memberId).isEqualTo(testMember.getMemberId());
    }

    @DisplayName("validToken(): 만료된 토큰인 때에 유효성 검증에 실패한다.")
    @Test
    void validateToken() {
        String token = JwtFactory.builder()
                .expiration(new Date(new Date().getTime() - Duration.ofDays(7).toMillis())).build().createToken(jwtProperties);
    boolean result = tokenProvider.validToken(token);

    //assertThat(result).isFailse();
    }
}
