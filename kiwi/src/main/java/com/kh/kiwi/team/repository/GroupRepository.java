package com.kh.kiwi.team.repository;

import com.kh.kiwi.team.entity.Group;
import com.kh.kiwi.team.entity.GroupId;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GroupRepository extends JpaRepository<Group, GroupId> {

    List<Group> findAllByMemberIdAndStatusNot(String memberId, String status);
    List<Group> findAllByTeamAndStatus(String team, String status);
    List<Group> findByTeam(String team);
    void deleteAllByTeam(String team);

    @Query("SELECT g FROM Group g JOIN FETCH g.member WHERE g.team = :team AND g.status != 'deleted'")
    List<Group> findByTeamWithMember(@Param("team") String team);
}
