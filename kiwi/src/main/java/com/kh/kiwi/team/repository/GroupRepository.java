package com.kh.kiwi.team.repository;

import com.kh.kiwi.team.entity.Group;
import com.kh.kiwi.team.entity.GroupId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupRepository extends JpaRepository<Group, GroupId> {
}
