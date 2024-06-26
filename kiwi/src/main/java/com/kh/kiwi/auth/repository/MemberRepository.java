package com.kh.kiwi.auth.repository;

import com.kh.kiwi.auth.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, String> {
    Member findByMemberId(String id);

}
