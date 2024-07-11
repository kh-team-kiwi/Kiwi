package com.kh.kiwi.team.controller;

import com.kh.kiwi.auth.dto.MemberDto;
import com.kh.kiwi.team.dto.*;
import com.kh.kiwi.team.entity.Team;
import com.kh.kiwi.team.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/team")
public class TeamController {

    private final TeamService teamService;

    /*
    * Home.js
    * 팀 생성 요청
    * */
    @PostMapping("/create/{memberId}")
    public ResponseTeamDto createTeam(@PathVariable String memberId, @RequestBody TeamCreateRequest dto) {
        return teamService.createTeam(memberId, dto);
    }

    /*
    * Home.js, Header.js
    * 헤더메뉴 소속팀 목록
    * */
    @GetMapping("/member/{memberId}")
    public List<Team> getAllTeams(@PathVariable String memberId) {
        return teamService.getAllTeams(memberId);
    }

    /*
     * Header.js
     * 소속된 팀의 멤버 권한 조회
     * */
    @GetMapping("/{teamno}/member/{memberId}")
    public String getRole(@PathVariable String teamno, @PathVariable String memberId) {
        return teamService.getRole(teamno,memberId);
    }

    /*
     * Home.js
     * 소속된 팀의 멤버 상태 조회
     * */
    @GetMapping("/{teamno}/member/{memberId}/status")
    public ResponseDto<?> getStatus(@PathVariable String teamno, @PathVariable String memberId) {
        return teamService.getStatus(teamno,memberId);
    }

    /*
     * Header.js
     * 팀 탈퇴 요청
     * */
    @DeleteMapping("/{teamno}/member/{memberId}")
    public ResponseDto<?> leaveTeam(@PathVariable String teamno, @PathVariable String memberId) {
        return teamService.leaveTeam(teamno, memberId);
    }

    /*
    * TeamsettingsUser.js
    * 팀 멤버 목록 조회
    * */
    @GetMapping("/{teamno}")
    public ResponseDto<?> getTeamMembers(@PathVariable String teamno) {
        return teamService.getTeamMembers(teamno);
    }

    /*
    * TeamsettigsUser.js
    * 유저 차단/차단해제 요청
    * */
    @PutMapping("/{teamno}/member/{memberId}/status/{status}")
    public ResponseDto<?> updateStatus(@PathVariable String teamno, @PathVariable String memberId, @PathVariable String status) {
        return teamService.updateStatus(teamno,memberId, status);
    }

    /*
    * TeamsettingsUser.js
    * 멤버 권한 변경 요청
    * */
    @PutMapping("/{teamno}")
    public ResponseDto<?> updateRole(@RequestBody List<TeamMemberDto> data, @PathVariable String teamno) {
        return teamService.updateRole(data,teamno);
    }

    /*
    * InviteMember.js
    * 멤버 초대 요청
    * */
    @PostMapping("/invite")
    public ResponseDto<?> inviteMember(@RequestBody TeamCreateRequest dto) {
        return teamService.inviteMember(dto);
    }

    /*
    * Team.js
    * 팀명 변경 요청
    * */
    @PutMapping("/{teamno}/teamname/{teamname}")
    public ResponseDto<?> updateTeamName(@PathVariable String teamno, @PathVariable String teamname) {
        return teamService.updateTeamName(teamno,teamname);
    }

    /*
    * Team.js
    * 팀 삭제 요청
    * */
    @PostMapping("/{team}/member/{memberId}/deleteTeam")
    public ResponseDto<?> deleteTeam(@PathVariable String team, @PathVariable String memberId, @RequestBody Map<String, String> RequestBody) {
        String password = RequestBody.get("password");
        return teamService.deleteTeam(team, memberId,password);
    }

    /*
     * Team.js
     * 팀 프로필 이미지 요청
     * */
    @PostMapping("/upload/profile")
    public ResponseDto<?> uploadProfile(@RequestParam(value = "profile") MultipartFile[] files,
                                        @RequestParam("team") String team,
                                        @RequestParam("memberId") String memberId) throws IOException {
        return teamService.uploadProfile(files, team, memberId);
    }
    // uploadProfile 에러 처리
    @ExceptionHandler(IOException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseDto<?> handleIOException(IOException e) {
        return ResponseDto.setFailed( "파일 처리 중 오류가 발생했습니다.");
    }

    /*
     * Team.js
     * owner 권한 양도 요청
     * */
    @PutMapping("/change/owner")
    public ResponseDto<?> changeOwner(@RequestBody Map<String, String> requestBody) {
        String teamno = requestBody.get("teamno");
        String newOwner = requestBody.get("newOwner");
        String oldOwner = requestBody.get("oldOwner");
        String password = requestBody.get("password");
        return teamService.changeOwner(teamno,newOwner,oldOwner, password);
    }

    /*
    * Team.js
    * owner 후보 검색 조회 요청
    * */
    @GetMapping("/{teamno}/searchkey/{key}")
    public ResponseDto<?> searchMember(@PathVariable String teamno, @PathVariable String key) {
        return teamService.searchMember(teamno,key);
    }

//    @GetMapping("/{teamId}")
//    public Optional<Team> getTeamById(@PathVariable String teamId) {
//        return teamService.getTeamById(teamId);
//    }

//    @PostMapping("/removeMember")
//    public ResponseDto<?> removeMember(@RequestParam String teamId, @RequestParam String memberId) {
//        return teamService.removeMember(teamId, memberId);
//    }

}
