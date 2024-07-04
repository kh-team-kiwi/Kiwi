package com.kh.kiwi.team.repository;

import com.kh.kiwi.team.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, String> {
    boolean existsByTeamName(String teamName);
    boolean existsByTeamAndTeamAdminMemberId(String Team, String MemberId);
    boolean existsByTeamAdminMemberId(String teamAdminMemberId);
}
