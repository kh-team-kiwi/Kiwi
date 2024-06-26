package com.kh.kiwi.team.dto;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class LeaveTeamRequestDto {
    private String memberId;
    private String team;
}
