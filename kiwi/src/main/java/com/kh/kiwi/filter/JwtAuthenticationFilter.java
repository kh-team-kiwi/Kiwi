package com.kh.kiwi.filter;

import com.kh.kiwi.member.service.AuthService;
import com.kh.kiwi.member.service.TokenHelper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final TokenHelper tokenHelper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Optional<String> t = extractToken(request);
        if (!(t.isEmpty())) {
            Authentication authentication = tokenHelper.validateToken(request, t.get()); //5. 토큰 검증 - 유효 여부 확인 & 인증된 인증 객체 생성 후 반환
            SecurityContextHolder.getContext().setAuthentication(authentication); // 6. SecurityContextHolder 에 인증 객체 저장
        } else {
            request.setAttribute("exception", "토큰 헤더가 잘못되었습니다. Authorization 을 넣어주세요.");
        }
        //다음 filterchain을 실행하며, 마지막 filterchain인 경우 Dispatcher Servlet이 실행된다.
        filterChain.doFilter(request, response);
    }

    private Optional<String> extractToken(ServletRequest request) {
        return Optional.ofNullable(((HttpServletRequest) request).getHeader("Authorization"));
    }
}
