package com.kh.kiwi.team.mapper;

import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TeamMapper {
    Integer getLastTeam();
}
