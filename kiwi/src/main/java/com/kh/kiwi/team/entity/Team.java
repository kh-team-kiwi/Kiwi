package com.kh.kiwi.team.entity;

import com.kh.kiwi.team.dto.TeamDto;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="team_list")
public class Team {
    @Id
    private String team;
    private String teamName;
    private String teamAdminMemberId;

    public Team(TeamDto dto, Integer no){
        String teamno = "000000";
        this.team=LocalDate.now().toString().replace("-","");
        this.teamName=dto.getTeamName();
        this.teamAdminMemberId=dto.getTeamAdminMemberId();
        if(no == null) {
            no=1;
        } else {
            no+=1;
        }

        teamno = teamno.substring(0,6-String.valueOf(no).length());
        teamno += String.valueOf(no);
        this.team+="_"+teamno;

    }
}
