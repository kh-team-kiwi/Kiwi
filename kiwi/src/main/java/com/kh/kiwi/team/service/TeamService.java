package com.kh.kiwi.team.service;

import com.kh.kiwi.aram.service.NotificationService;
import com.kh.kiwi.auth.dto.MemberDto;
import com.kh.kiwi.auth.entity.Member;
import com.kh.kiwi.auth.repository.MemberRepository;
import com.kh.kiwi.documents.entity.MemberDetails;
import com.kh.kiwi.documents.repository.MemberDetailsRepository;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import javax.swing.text.html.Option;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final GroupRepository groupRepository;
    private final TeamMapper teamMapper;
    private final CompanyRepository companyRepository;
    private final MemberRepository memberRepository;
    private final MemberDetailsRepository memberDetailsRepository;
    private final NotificationService notificationService;

    @Value("${aws.s3.bucket}")
    private String bucketName;
    private final S3Client s3Client;
    private final String preFilePath = "http://localhost:8080/api/transfer/download?fileKey=";

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
        group.setStatus("JOINED");

        // Company entity 생성 및 저장
        Company company = new Company(team.getTeam(), team.getTeamName());

        // MemberDetails entity 생성 및 저장
        MemberDetails memberDetails = new MemberDetails();
        memberDetails.setCompanyNum(company.getCompanyNum());
        memberDetails.setMemberId(memberId);
        memberDetails.setEmployeeNo(company.getCompanyNum() + "@" + memberId.split("@")[0]);
        memberDetails.setName(company.getCompanyName()+"팀 담당자 (이름 수정)");
        memberDetails.setGender("남자");
        memberDetails.setBirthDate(LocalDate.parse("2000-01-01"));
        memberDetails.setEmpDate(LocalDate.parse("2000-01-01"));
        memberDetails.setQuitDate(null);
        memberDetails.setPhone("010-0000-0000");
        memberDetails.setAddress("서울시 강남구");
        memberDetails.setDeptName("테스트부서");
        memberDetails.setTitle("사원");
        memberDetails.setPosition("팀원");
        memberDetails.setDocSecurity(9);
        memberDetails.setDayOff(null);
        memberDetails.setUsedDayOff(null);

        try {
            teamRepository.save(team); // 팀 정보를 먼저 저장합니다.
            companyRepository.save(company); // 그 다음에 회사 정보를 저장합니다.
            groupRepository.save(group);
            memberDetailsRepository.save(memberDetails); // 그 다음에 사원 정보를 저장합니다.

            invitedMembers.forEach(member -> {
                Group invite = Group.builder()
                        .team(team.getTeam())
                        .memberId(member.getUsername())
                        .role("MEMBER")
                        .status("JOINED")
                        .build();
                groupRepository.save(invite);
            });

            for (MemberDto member : invitedMembers) {
                notificationService.customNotify(member.getUsername(), "팀에 초대되었습니다.", "INVITE", "sse");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseTeamDto.setFailed("데이터베이스 연결에 실패했습니다.");
        }
        return ResponseTeamDto.setSuccessData("팀생성에 성공했습니다.", team);
    }

    // 새로운 멤버 관리 메서드 추가
    @Transactional
    public ResponseDto<?> getTeamMembers(String teamno) {
        try{
            List<Group> groups = groupRepository.findByTeamWithMember(teamno);

            return ResponseDto.setSuccessData("팀원 조회를 성공했습니다.",
                    groups.stream()
                            .map(group -> TeamMemberDto.builder()
                                    .memberId(group.getMemberId())
                                    .team(group.getTeam())
                                    .role(group.getRole())
                                    .status(group.getStatus())
                                    .memberFilepath(group.getMember().getMemberFilepath())
                                    .memberNickname(group.getMember().getMemberNickname())
                                    .build())
                            .collect(Collectors.toList()));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.setFailed("데이트베이스 오류로 실패했습니다.");
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

    public ResponseDto<?> updateTeamName(String team, String teamName, String memberId){
        try{
            Optional<Team> searchTeam = teamRepository.findById(team);
            if (searchTeam.isEmpty()) {
                return ResponseDto.setFailed("팀 이름 변경에 실패했습니다. 존재하지 않는 팀입니다.");
            } else {
                Team newTeam = searchTeam.get();
                newTeam.setTeamName(teamName);
                teamRepository.save(newTeam);
                return ResponseDto.setSuccess("팀 이름을 변경했습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.setFailed("데이터베이스 오류로 팀 이름 변경에 실패했습니다.");
        }
    }

    @Transactional
    public ResponseDto<?> deleteTeam(String team, String memberId) {
        try{
            if(teamRepository.existsByTeamAndTeamAdminMemberId(team,memberId)) {
                groupRepository.deleteAllByTeam(team);
                teamRepository.deleteById(team);
                return ResponseDto.setSuccess("성공적으로 삭제되었습니다.");
            } else {
                return ResponseDto.setFailed("조건이 일치하지 않아 삭제에 실패했습니다.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.setFailed("데이터베이스 오류로 팀 삭제에 실패했습니다.");
        }
    }

    public ResponseDto<?> uploadProfile(MultipartFile[] files, String team, String memberId) throws IOException {
        String fileCode = UUID.randomUUID().toString();
        String fileKey = team+"/profile/"+fileCode; //

        try{
            Optional<Team> searchTeam = teamRepository.findById(team);
            if (searchTeam.isEmpty()) {
                return ResponseDto.setFailed("팀을 조회할 수 없습니다.");
            }

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileKey)
                    .build();

            s3Client.putObject(putObjectRequest, software.amazon.awssdk.core.sync.RequestBody.fromInputStream(files[0].getInputStream(), files[0].getSize()));

            searchTeam.get().setTeamFilepath(preFilePath+fileKey);
            teamRepository.save(searchTeam.get());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.setFailed("오류가 발생해 저장을 실패했습니다.");
        }

        return ResponseDto.setSuccess("성공적으로 프로필을 저장했습니다.");
    }

    @Transactional
    public ResponseDto<?> inviteMember(TeamCreateRequest tcdto) {
        try{
            if(!teamRepository.existsById(tcdto.getTeamName())) return ResponseDto.setFailed("팀을 찾을 수 없습니다.");
            List<MemberDto> invitedMembers = tcdto.getInvitedMembers();
            invitedMembers.forEach(member -> {
                Group invite = Group.builder()
                        .team(tcdto.getTeamName())
                        .memberId(member.getUsername())
                        .role("MEMBER")
                        .status("JOINED")
                        .build();
                groupRepository.save(invite);
            });
            return ResponseDto.setSuccess("초대되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.setFailed("데이터베이스 오류로 실패했습니다.");
        }
    }

    @Transactional
    public ResponseDto<?> updateRole(List<TeamMemberDto> updateMembers, String teamno) {
        try{
            if(!teamRepository.existsById(teamno)) return ResponseDto.setFailed("팀을 찾을 수 없습니다.");
            updateMembers.forEach(member -> {
                Group update = Group.builder()
                        .team(member.getTeam())
                        .memberId(member.getMemberId())
                        .role(member.getRole())
                        .status(member.getStatus())
                        .build();
                groupRepository.save(update);
            });
            return ResponseDto.setSuccess("반영되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.setFailed("데이터베이스 오류로 실패했습니다.");
        }
    }

    public ResponseDto<?> searchMember(String teamno, String searchKey) {
        try{
            List<Group> groups = groupRepository.findByTeamWithMember(teamno);
            if(groups==null||groups.isEmpty()) return ResponseDto.setSuccess("조회된 인원이 없습니다.");
            List<TeamMemberDto> filteredGroups = groups.stream().filter(group -> group.getMemberId().contains(searchKey))
                    .map(group -> TeamMemberDto.builder()
                            .memberId(group.getMemberId())
                            .team(group.getTeam())
                            .role(group.getRole())
                            .status(group.getStatus())
                            .memberFilepath(group.getMember().getMemberFilepath())
                            .memberNickname(group.getMember().getMemberNickname())
                            .build()).toList();
            if(filteredGroups.size()>5) filteredGroups.subList(0,5);
            return ResponseDto.setSuccessData("조회되었습니다.",filteredGroups);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.setFailed("데이터베이스 오류로 실패했습니다.");
        }
    }

    @Transactional
    public ResponseDto<?> changeOwner(String teamno,String newOwner,String oldOwner) {
        try{
            Optional<Team> searchTeam = teamRepository.findById(teamno);
            if(searchTeam.isEmpty()) return ResponseDto.setFailed("팀을 조회할 수 없습니다.");


            Optional<Group> predecessor = groupRepository.findById(GroupId.builder().team(teamno).memberId(oldOwner).build());
            Optional<Group> successor = groupRepository.findById(GroupId.builder().team(teamno).memberId(newOwner).build());
            if(predecessor.isEmpty()||successor.isEmpty()) return ResponseDto.setFailed("존재하지 않는 멤버입니다.");

            searchTeam.get().setTeamAdminMemberId(newOwner);
            successor.get().setRole("OWNER");
            predecessor.get().setRole("ADMIN");

            teamRepository.save(searchTeam.get());
            groupRepository.save(successor.get());
            groupRepository.save(predecessor.get());

            return ResponseDto.setSuccess("변경되었습니다.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseDto.setFailed("데이터베이스 오류로 실패했습니다.");
        }
    }
}