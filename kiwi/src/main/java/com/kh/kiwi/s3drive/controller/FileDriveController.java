package com.kh.kiwi.s3drive.controller;

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
    public FileDriveDTO createDrive(@RequestBody FileDriveDTO fileDriveDTO) {
        return fileDriveService.createDrive(fileDriveDTO);
    }

    @GetMapping("/list")
    public List<FileDriveDTO> listDrives() {
        return fileDriveService.listDrives();
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
