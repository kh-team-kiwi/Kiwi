package com.kh.kiwi.auth.jwt;

import com.kh.kiwi.auth.dto.CustomOAuth2User;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;

@Component
@Slf4j
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JWTUtil jwtUtil;

    public CustomSuccessHandler(JWTUtil jwtUtil) {
        System.out.println("CustomSuccessHandler : "+jwtUtil );
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        System.out.println("onAuthenticationSuccess : "+authentication);
        //유저 정보
        String username = authentication.getName();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        //토큰 생성
        String access = jwtUtil.createJwt("access", username, role, 600000L); // 10분
        String refresh = jwtUtil.createJwt("refresh", username, role, 86400000L); // 24시간

//        log.info("=======ejkim=====");
//        log.info(access);
//        log.info(refresh);
//        String url = makeRedirectUrl(access);
//        System.out.println("url : "+url);

        //응답 설정 : 헤더에 저장한 값은 리다이렉트로 전달되지 않아 프론트에서 다시 axios로 요청해야한다.
        //response.setHeader("access-token", access);
        response.addCookie(createCookie("refresh-token", refresh));
        response.setStatus(HttpStatus.OK.value());

        response.sendRedirect("http://localhost:3000/oauth2/redirect");
    }

    private String makeRedirectUrl(String token) {
        System.out.println("makeRedirectUrl : "+token);
        return UriComponentsBuilder.fromUriString("http://localhost:3000/oauth2/redirect/"+token)
                .build().toUriString();
    }

    private Cookie createCookie(String key, String value) {
        System.out.println("createCookie : "+key + ":"+value);
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);
        //cookie.setSecure(true);
        //cookie.setPath("/");
        cookie.setHttpOnly(true);

        return cookie;
    }
}