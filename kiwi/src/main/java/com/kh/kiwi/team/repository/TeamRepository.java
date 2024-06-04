package com.kh.kiwi.team.repository;

import com.kh.kiwi.team.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeamRepository extends JpaRepository<Team, String> {
    boolean existsByTeamName(String teamName);
}
