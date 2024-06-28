package com.kh.kiwi.team.controller;

import com.kh.kiwi.auth.dto.MemberDto;
import com.kh.kiwi.team.dto.*;
import com.kh.kiwi.team.entity.Team;
import com.kh.kiwi.team.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
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
}
