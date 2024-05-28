package com.kh.kiwi.member.repository;

import com.kh.kiwi.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, String> {

}
