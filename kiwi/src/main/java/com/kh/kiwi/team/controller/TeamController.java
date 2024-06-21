package com.kh.kiwi.team.controller;

import com.kh.kiwi.team.dto.ResponseTeamDto;
import com.kh.kiwi.team.dto.TeamCreateRequest;
import com.kh.kiwi.team.dto.TeamDto;
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
        return teamService.createTeam(memberId,dto);
    }

    @GetMapping("/{teamId}")
    public Optional<Team> getTeamById(@PathVariable String teamId) {
        return teamService.getTeamById(teamId);
    }

//    @GetMapping
//    public List<Team> getAllTeams() {
//        return teamService.getAllTeams(null);
//    }
    @GetMapping("/list/{memberId}")
    public List<Team> getAllTeams(@PathVariable String memberId) {
        return teamService.getAllTeams(memberId);
    }

    @GetMapping("/list/{memberId}")
    public List<Team> getAllTeams(@PathVariable String memberId) {
        return teamService.getAllTeams(memberId);
    }

}
