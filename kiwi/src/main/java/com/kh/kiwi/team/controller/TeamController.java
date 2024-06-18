package com.kh.kiwi.team.controller;

import com.kh.kiwi.team.dto.ResponseTeamDto;
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
    public ResponseTeamDto createTeam(@RequestBody TeamDto teamDto) {
        return teamService.createTeam(teamDto);
    }

    @GetMapping("/{teamId}")
    public Optional<Team> getTeamById(@PathVariable String teamId) {
        return teamService.getTeamById(teamId);
    }
    @GetMapping
    public List<Team> getAllTeams() {
        return teamService.getAllTeams();
    }
}
