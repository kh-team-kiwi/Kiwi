package com.kh.kiwi.team.repository;

import com.kh.kiwi.team.entity.Group;
import com.kh.kiwi.team.entity.GroupId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GroupRepository extends JpaRepository<Group, GroupId> {
    List<Group> findAllByMemberId(String memberId);
}
