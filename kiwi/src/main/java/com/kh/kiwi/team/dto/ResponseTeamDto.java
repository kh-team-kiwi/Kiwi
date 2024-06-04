package com.kh.kiwi.team.dto;

import com.kh.kiwi.team.entity.Team;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor(staticName = "set")
public class ResponseTeamDto {
    private boolean result;
    private String message;
    private Team team;

    public static ResponseTeamDto setSuccessData(String msg, Team dto){
        return ResponseTeamDto.set(true,msg,dto);
    }

    public static ResponseTeamDto setFailed(String msg){
        return ResponseTeamDto.set(false,msg,null);
    }

    public static ResponseTeamDto setSuccess(String msg){
        return ResponseTeamDto.set(true,msg,null);
    }
}
