package com.kh.kiwi.team.service;

import com.kh.kiwi.team.dto.ResponseTeamDto;
import com.kh.kiwi.team.dto.TeamDto;
import com.kh.kiwi.team.entity.Group;
import com.kh.kiwi.team.entity.Team;
import com.kh.kiwi.team.mapper.TeamMapper;
import com.kh.kiwi.team.repository.GroupRepository;
import com.kh.kiwi.team.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final GroupRepository groupRepository;
    private final TeamMapper teamMapper;

    @Transactional
    public ResponseTeamDto createTeam(TeamDto dto) {

        // 금일 가장 최근에 생성된 팀의 PK 조회
        Integer no = teamMapper.getLastTeam();
        Team team = new Team(dto, no);
        System.out.println(no);
        Group group = new Group();
        group.setTeam(team.getTeam());
        group.setMemberId(team.getTeamAdminMemberId());
        try{
            teamRepository.save(team);
            groupRepository.save(group);
        } catch ( Exception e ) {
            return ResponseTeamDto.setFailed("데이터베이스 연결에 실패했습니다.");
        }
        return ResponseTeamDto.setSuccessData("팀생성에 성공했습니다.",team);
    }

    public ResponseTeamDto deleteTeam(Team dto, String teamno) {
        try{
            if(teamRepository.existsByTeamName(dto.getTeamName())){
                return ResponseTeamDto.setFailed("데이터 베이스에 해당 팀이 존재하지 않습니다.");
            }
        } catch (Exception e) {
            return ResponseTeamDto.setFailed("데이터베이스 연결에 실패했습니다.");
        }
        try{
            teamRepository.delete(dto);
        } catch ( Exception e ) {
            return ResponseTeamDto.setFailed("데이터베이스 연결에 실패했습니다.");
        }
        return ResponseTeamDto.setSuccessData("팀 삭제를 성공했습니다.",dto);
    }


}
