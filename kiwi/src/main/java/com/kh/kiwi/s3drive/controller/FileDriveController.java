package com.kh.kiwi.s3drive.controller;

import com.kh.kiwi.s3drive.dto.CreateDriveRequest;
import com.kh.kiwi.s3drive.dto.FileDriveDTO;
import com.kh.kiwi.s3drive.service.FileDriveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drive")
public class FileDriveController {

    private final FileDriveService fileDriveService;

    @Autowired
    public FileDriveController(FileDriveService fileDriveService) {
        this.fileDriveService = fileDriveService;
    }

    @PostMapping("/create")
    public FileDriveDTO createDrive(@RequestBody CreateDriveRequest createDriveRequest) {
        return fileDriveService.createDrive(createDriveRequest.getFileDriveDTO(), createDriveRequest.getUserIds());
    }
    //전부
    @GetMapping("/list")
    public List<FileDriveDTO> listDrives() {
        return fileDriveService.listDrives();
    }
    //팀
    @GetMapping("/list/{team}")
    public List<FileDriveDTO> listDrivesByTeam(@PathVariable String team) {
        return fileDriveService.listDrivesByTeam(team);
    }
    //팀 ,유저
    @GetMapping("/list/{team}/{memberId}")
    public List<FileDriveDTO> listDrivesByUserAndTeam(@PathVariable String team, @PathVariable String memberId) {
        return fileDriveService.listDrivesByUserAndTeam(memberId, team);
    }

    @DeleteMapping("/{driveCode}")
    public void deleteDrive(@PathVariable String driveCode) {
        fileDriveService.deleteDrive(driveCode);
    }

    @PutMapping("/{driveCode}")
    public void updateDrive(@PathVariable String driveCode, @RequestBody FileDriveDTO fileDriveDTO) {
        fileDriveService.updateDrive(driveCode, fileDriveDTO);
    }
}
