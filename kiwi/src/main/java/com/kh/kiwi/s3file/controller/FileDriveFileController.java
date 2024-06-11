package com.kh.kiwi.s3file.controller;

import com.kh.kiwi.s3file.dto.FileDriveFileDTO;
import com.kh.kiwi.s3file.service.FileDriveFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/drive")
public class FileDriveFileController {

    private final FileDriveFileService fileDriveFileService;

    @Autowired
    public FileDriveFileController(FileDriveFileService fileDriveFileService) {
        this.fileDriveFileService = fileDriveFileService;
    }

    @GetMapping("/{driveCode}/files")
    public List<FileDriveFileDTO> getFiles(@PathVariable String driveCode) {
        return fileDriveFileService.getFilesByDriveCode(driveCode);
    }

    @PostMapping("/{driveCode}/files/upload")
    public List<FileDriveFileDTO> uploadFiles(@PathVariable String driveCode, @RequestParam("files") MultipartFile[] files) {
        return Arrays.stream(files)
                .map(file -> fileDriveFileService.uploadFile(driveCode, file))
                .collect(Collectors.toList());
    }
}
