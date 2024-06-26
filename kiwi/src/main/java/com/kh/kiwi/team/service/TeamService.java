package com.kh.kiwi.team.service;

import com.kh.kiwi.auth.dto.MemberDto;
import com.kh.kiwi.team.dto.*;
import com.kh.kiwi.team.entity.Group;
import com.kh.kiwi.team.entity.GroupId;
import com.kh.kiwi.team.entity.Team;
import com.kh.kiwi.team.mapper.TeamMapper;
import com.kh.kiwi.team.repository.GroupRepository;
import com.kh.kiwi.team.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

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
        group.setRole("OWNER");

        try{
            teamRepository.save(team);
            groupRepository.save(group);

            invitedMembers.forEach(member -> {
                Group invite = Group.builder()
                        .team(team.getTeam())
                        .memberId(member.getUsername())
                        .role("MEMBER")
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

    public ResponseDto<?> leaveTeam(LeaveTeamRequestDto dto){

        try{
            Optional<Team> searchTeam = teamRepository.findById(dto.getTeam());
            if(searchTeam.isEmpty()){
                return ResponseDto.setFailed("존재하지 않는 팀번호 입니다.");
            }
            if(searchTeam.get().getTeamAdminMemberId().equals(dto.getMemberId())){
                return ResponseDto.setFailed("팀 소유자는 탈퇴할 수 없습니다.");
            }
            GroupId serchGrop = GroupId.builder().team(dto.getTeam()).memberId(dto.getMemberId()).build();
            if(groupRepository.existsById(serchGrop)){
                groupRepository.deleteById(serchGrop);
            } else {
                return ResponseDto.setFailed("존재하지 않는 팀원 입니다.");
            }
        } catch (Exception e ){
            e.printStackTrace();
            return ResponseDto.setFailed("데이터베이스 오류로 실패했습니다.");
        }

        return ResponseDto.setSuccess("성공적으로 팀을 나왔습니다.");
    }

}
