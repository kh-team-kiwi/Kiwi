package com.kh.kiwi.member.repository;

import com.kh.kiwi.member.entity.Token;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRepository extends JpaRepository<Token, String> {
    String findTokenByMemberId(String memberId);
}
