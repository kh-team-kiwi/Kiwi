package com.kh.kiwi.team.service;

import com.kh.kiwi.auth.dto.MemberDto;
import com.kh.kiwi.auth.entity.Member;
import com.kh.kiwi.auth.repository.MemberRepository;
import com.kh.kiwi.team.dto.*;
import com.kh.kiwi.team.entity.Company;
import com.kh.kiwi.team.entity.Group;
import com.kh.kiwi.team.entity.GroupId;
import com.kh.kiwi.team.entity.Team;
import com.kh.kiwi.team.mapper.TeamMapper;
import com.kh.kiwi.team.repository.CompanyRepository;
import com.kh.kiwi.team.repository.GroupRepository;
import com.kh.kiwi.team.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final GroupRepository groupRepository;
    private final TeamMapper teamMapper;
    private final CompanyRepository companyRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public ResponseTeamDto createTeam(String memberId, TeamCreateRequest tcdto) {
        TeamDto dto = TeamDto.builder().teamAdminMemberId(memberId).teamName(tcdto.getTeamName()).build();
        List<MemberDto> invitedMembers = tcdto.getInvitedMembers();

        System.out.println("TeamService > createTeam : " + dto);
        System.out.println("TeamService > createTeam : " + invitedMembers);

        // 금일 가장 최근에 생성된 팀의 PK 조회
        Integer no = teamMapper.getLastTeam();
        Team team = new Team(dto, no);
        System.out.println(no);
        Group group = new Group();
        group.setTeam(team.getTeam());
        group.setMemberId(team.getTeamAdminMemberId());
        group.setRole("OWNER");

        // Company entity 생성 및 저장
        Company company = new Company(team.getTeam(), team.getTeamName());

        try {
            teamRepository.save(team); // 팀 정보를 먼저 저장합니다.
            companyRepository.save(company); // 그 다음에 회사 정보를 저장합니다.
            groupRepository.save(group);

            invitedMembers.forEach(member -> {
                Group invite = Group.builder()
                        .team(team.getTeam())
                        .memberId(member.getUsername())
                        .role("MEMBER")
                        .build();
                groupRepository.save(invite);
            });

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseTeamDto.setFailed("데이터베이스 연결에 실패했습니다.");
        }
        return ResponseTeamDto.setSuccessData("팀생성에 성공했습니다.", team);
    }

    // 새로운 멤버 관리 메서드 추가
    @Transactional
    public ResponseDto<List<MemberDto>> getTeamMembers(String teamId) {
        List<Group> groups = groupRepository.findByTeam(teamId);
        List<MemberDto> members = groups.stream()
                .map(group -> {
                    Optional<Member> memberOpt = memberRepository.findById(group.getMemberId());
                    if (memberOpt.isPresent()) {
                        Member member = memberOpt.get();
                        return new MemberDto(member.getMemberId(), member.getMemberNickname(), group.getRole());
                    }
                    return null;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        return ResponseDto.setSuccessData("멤버 조회에 성공했습니다.", members);
    }

    @Transactional
    public ResponseDto<?> updateMemberRole(String teamId, String memberId, String role) {
        try {
            GroupId groupId = new GroupId(memberId, teamId);
            Optional<Group> groupOpt = groupRepository.findById(groupId);

            if (groupOpt.isPresent()) {
                Group group = groupOpt.get();
                group.setRole(role);
                groupRepository.save(group);
                return ResponseDto.setSuccess("권한 변경에 성공했습니다.");
            } else {
                return ResponseDto.setFailed("존재하지 않는 팀원입니다.");
            }
        } catch (Exception e) {
            return ResponseDto.setFailed("데이터베이스 오류로 실패했습니다.");
        }
    }

    @Transactional
    public ResponseDto<?> removeMember(String teamId, String memberId) {
        try {
            GroupId groupId = new GroupId(memberId, teamId);
            Optional<Group> groupOpt = groupRepository.findById(groupId);

            if (groupOpt.isPresent()) {
                groupRepository.deleteById(groupId);
                return ResponseDto.setSuccess("팀원 추방에 성공했습니다.");
            } else {
                return ResponseDto.setFailed("존재하지 않는 팀원입니다.");
            }
        } catch (Exception e) {
            return ResponseDto.setFailed("데이터베이스 오류로 실패했습니다.");
        }
    }

    public ResponseTeamDto deleteTeam(Team dto, String teamno) {
        try {
            if (!teamRepository.existsByTeamName(dto.getTeamName())) {
                return ResponseTeamDto.setFailed("데이터 베이스에 해당 팀이 존재하지 않습니다.");
            }
        } catch (Exception e) {
            return ResponseTeamDto.setFailed("데이터베이스 연결에 실패했습니다.");
        }
        try {
            teamRepository.delete(dto);
        } catch (Exception e) {
            return ResponseTeamDto.setFailed("데이터베이스 연결에 실패했습니다.");
        }
        return ResponseTeamDto.setSuccessData("팀 삭제를 성공했습니다.", dto);
    }

    public Optional<Team> getTeamById(String teamId) {
        return teamRepository.findById(teamId);
    }

    public List<Team> getAllTeams(String memberId) {
        List<Group> groups = groupRepository.findAllByMemberId(memberId);
        System.out.println("TeamService > getAllTeams : " + groups);

        return groups.stream()
                .map(Group::getTeam) // Group 객체에서 teamId를 추출
                .map(teamRepository::findById) // teamId로 Team 객체 조회
                .filter(Optional::isPresent) // Optional이 존재하는지 확인
                .map(Optional::get) // Optional에서 Team 객체를 추출
                .collect(Collectors.toList()); // List<Team>으로 수집
    }

    public ResponseDto<?> leaveTeam(LeaveTeamRequestDto dto) {
        try {
            Optional<Team> searchTeam = teamRepository.findById(dto.getTeam());
            if (searchTeam.isEmpty()) {
                return ResponseDto.setFailed("존재하지 않는 팀번호 입니다.");
            }
            if (searchTeam.get().getTeamAdminMemberId().equals(dto.getMemberId())) {
                return ResponseDto.setFailed("팀 소유자는 탈퇴할 수 없습니다.");
            }
            GroupId searchGroup = GroupId.builder().team(dto.getTeam()).memberId(dto.getMemberId()).build();
            if (groupRepository.existsById(searchGroup)) {
                groupRepository.deleteById(searchGroup);
            } else {
                return ResponseDto.setFailed("존재하지 않는 팀원 입니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.setFailed("데이터베이스 오류로 실패했습니다.");
        }

        return ResponseDto.setSuccess("성공적으로 팀을 나왔습니다.");
    }

    public String getRole(String teamno, String memberId) {
        return groupRepository.findById(GroupId.builder().team(teamno).memberId(memberId).build()).get().getRole();
    }
}
