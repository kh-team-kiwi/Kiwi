package com.kh.kiwi.team.controller;

import com.kh.kiwi.auth.dto.MemberDto;
import com.kh.kiwi.team.dto.*;
import com.kh.kiwi.team.entity.Team;
import com.kh.kiwi.team.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/team")
public class TeamController {


    private final TeamService teamService;

    @PostMapping("/create")
    public ResponseTeamDto createTeam(@RequestParam String memberId, @RequestBody TeamCreateRequest dto) {
        return teamService.createTeam(memberId, dto);
    }

    @GetMapping("/{teamId}")
    public Optional<Team> getTeamById(@PathVariable String teamId) {
        return teamService.getTeamById(teamId);
    }

    @GetMapping("/list/{memberId}")
    public List<Team> getAllTeams(@PathVariable String memberId) {
        return teamService.getAllTeams(memberId);
    }

    @GetMapping("/{teamId}/members")
    public ResponseDto<List<MemberDto>> getTeamMembers(@PathVariable String teamId) {
        return teamService.getTeamMembers(teamId);
    }

    @PostMapping("/leaveTeam")
    public ResponseDto<?> leaveTeam(@RequestBody LeaveTeamRequestDto dto) {
        return teamService.leaveTeam(dto);
    }

    @GetMapping("/getRole/team/{teamno}/member/{memberId}")
    public String getRole(@PathVariable String teamno, @PathVariable String memberId) {
        return teamService.getRole(teamno,memberId);
    }

    @PostMapping("/updateRole")
    public ResponseDto<?> updateMemberRole(@RequestParam String teamId, @RequestParam String memberId, @RequestParam String role) {
        return teamService.updateMemberRole(teamId, memberId, role);
    }

    @PostMapping("/removeMember")
    public ResponseDto<?> removeMember(@RequestParam String teamId, @RequestParam String memberId) {
        return teamService.removeMember(teamId, memberId);
    }

    @PostMapping("/update/team/{team}/teamsettings/team-manage/{teamName}")
    public ResponseDto<?> updateTeamName(@PathVariable String team, @PathVariable String teamName, @RequestBody String member) {
        return teamService.updateTeamName(team,teamName, member);
    }

    @PostMapping("/delete/team/{team}/teamsettings/team-manage")
    public ResponseDto<?> deleteTeam(@PathVariable String team, @RequestBody Map<String, String> requestBody) {
        String memberId = requestBody.get("memberId");
        return teamService.deleteTeam(team, memberId);
    }

    @PostMapping("/upload/profile")
    public ResponseDto<?> uploadProfile(@RequestParam("profile") MultipartFile[] files,
                                        @RequestParam("team") String team,
                                        @RequestParam("memberId") String memberId) {
        return teamService.uploadProfile(files, team, memberId);
    }
}
