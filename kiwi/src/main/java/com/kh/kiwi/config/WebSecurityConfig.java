package com.kh.kiwi.config;

import com.kh.kiwi.auth.jwt.*;
import com.kh.kiwi.auth.repository.RefreshRepository;
import com.kh.kiwi.auth.service.CustomOAuth2UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Collections;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomSuccessHandler customSuccessHandler;
    private final JWTUtil jwtUtil;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, RefreshRepository refreshRepository, AuthenticationConfiguration authenticationConfiguration) throws Exception {
        AuthenticationManager authenticationManager = authenticationConfiguration.getAuthenticationManager();
        LoginFilter loginFilter = new LoginFilter(authenticationManager, jwtUtil, refreshRepository);

        // 여기서 cors 설정은 security의 cors 설정이다. WebConfig의 cors 설정과 다름.
        http
                .cors(corsCustomizer -> corsCustomizer.configurationSource(new CorsConfigurationSource() {

                    @Override
                    public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {

                        CorsConfiguration configuration = new CorsConfiguration();

                        configuration.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));
                        configuration.setAllowedMethods(Collections.singletonList("*"));
                        configuration.setAllowCredentials(true);
                        configuration.setAllowedHeaders(Collections.singletonList("*"));
                        configuration.setMaxAge(3600L);

                        configuration.setExposedHeaders(Collections.singletonList("Set-Cookie"));
                        configuration.setExposedHeaders(Collections.singletonList("Authorization"));

                        return configuration;
                    }
                }));
        // JWTFilter 추가
        http
                .addFilterAfter(new JWTFilter(jwtUtil), UsernamePasswordAuthenticationFilter.class);

        http
                .addFilterAt(loginFilter, UsernamePasswordAuthenticationFilter.class);

        http
                .addFilterBefore(new CustomLogoutFilter(jwtUtil, refreshRepository), LogoutFilter.class);

        //oauth2
        http
                .oauth2Login(
                        (oauth2) -> oauth2
                                .userInfoEndpoint(
                                        (userInfoEndpointConfig) -> userInfoEndpointConfig
                                                .userService(customOAuth2UserService)
                                )
                                .successHandler(customSuccessHandler)
                );

        http
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
//                .formLogin((formLogin)->formLogin
//                        .loginPage("/login")
//                        .defaultSuccessUrl("/main"))
                .logout(AbstractHttpConfigurer::disable)
//                .logout((logout)->logout
//                        .logoutSuccessUrl("/login")
//                        .invalidateHttpSession(true))
                .httpBasic(AbstractHttpConfigurer::disable)
                .sessionManagement((session)-> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests((authorizeHttpRequests) -> authorizeHttpRequests
                        .requestMatchers("/api/auth/signup","/api/auth/login","/api/drive/**","/api/drive/create","/api/team/create").permitAll()
                        .requestMatchers("/auth").permitAll()
                        .requestMatchers("/reissue").permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/api/admin")).hasRole("JADMIN")
                        .anyRequest().authenticated());
        return http.build();
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}