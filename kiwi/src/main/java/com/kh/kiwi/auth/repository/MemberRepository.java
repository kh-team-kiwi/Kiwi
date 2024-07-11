package com.kh.kiwi.auth.repository;

import com.kh.kiwi.auth.entity.Member;
import com.kh.kiwi.team.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, String> {
    Member findByMemberId(String id);
    Member findAllByMemberIdAndMemberStatus(String team, String status);
}
