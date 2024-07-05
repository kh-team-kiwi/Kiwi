package com.kh.kiwi.team.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TeamMemberDto {
    private String memberNickname;
    private String memberId;
    private String team;
    private String role;
    private String status;
    private String memberFilepath;
}
