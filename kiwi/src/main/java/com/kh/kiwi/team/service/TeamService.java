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
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import javax.swing.text.html.Option;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
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
}