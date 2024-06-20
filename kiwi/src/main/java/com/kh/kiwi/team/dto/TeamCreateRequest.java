package com.kh.kiwi.team.dto;

import com.kh.kiwi.auth.dto.MemberDto;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TeamCreateRequest {
    private String teamName;
    private List<MemberDto> invitedMembers;
}
