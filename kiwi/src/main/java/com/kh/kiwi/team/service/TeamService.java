package com.kh.kiwi.team.service;

import com.kh.kiwi.auth.dto.MemberDto;
import com.kh.kiwi.team.dto.ResponseTeamDto;
import com.kh.kiwi.team.dto.TeamCreateRequest;
import com.kh.kiwi.team.dto.TeamDto;
import com.kh.kiwi.team.entity.Group;
import com.kh.kiwi.team.entity.Team;
import com.kh.kiwi.team.mapper.TeamMapper;
import com.kh.kiwi.team.repository.GroupRepository;
import com.kh.kiwi.team.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final GroupRepository groupRepository;
    private final TeamMapper teamMapper;

    @Transactional
    public ResponseTeamDto createTeam(String memberId, TeamCreateRequest tcdto) {
        TeamDto dto = TeamDto.builder().teamAdminMemberId(memberId).teamName(tcdto.getTeamName()).build();
        List<MemberDto> invitedMembers = tcdto.getInvitedMembers();

        System.out.println("TeamService > createTeam : "+dto);
        System.out.println("TeamService > createTeam : "+invitedMembers);

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

            invitedMembers.forEach(member -> {
                Group invite = Group.builder()
                        .team(team.getTeam())
                        .memberId(member.getUsername())
                        .build();
                groupRepository.save(invite);
            });

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

    public Optional<Team> getTeamById(String teamId) {
        return teamRepository.findById(teamId);
    }

//    public List<Team> getAllTeams(String memberId) {
//        // memberId를 사용하는 경우 로직 추가, 필요하지 않다면 아래 코드로 대체 가능
//        return teamRepository.findAll();
//    }
    public List<Team> getAllTeams(String memberId) {
        List<Group> groups = groupRepository.findAllByMemberId(memberId);
        System.out.println("TeamService > getAllTeams : "+groups);

        return groups.stream()
                .map(Group::getTeam) // Group 객체에서 teamId를 추출
                .map(teamRepository::findById) // teamId로 Team 객체 조회
                .filter(Optional::isPresent) // Optional이 존재하는지 확인
                .map(Optional::get) // Optional에서 Team 객체를 추출
                .collect(Collectors.toList()); // List<Team>으로 수집
    }

    public List<Team> getAllTeams(String memberId) {
        List<Group> groups = groupRepository.findAllByMemberId(memberId);
        System.out.println("TeamService > getAllTeams : "+groups);

        return groups.stream()
                .map(Group::getTeam) // Group 객체에서 teamId를 추출
                .map(teamRepository::findById) // teamId로 Team 객체 조회
                .filter(Optional::isPresent) // Optional이 존재하는지 확인
                .map(Optional::get) // Optional에서 Team 객체를 추출
                .collect(Collectors.toList()); // List<Team>으로 수집
    }



}
