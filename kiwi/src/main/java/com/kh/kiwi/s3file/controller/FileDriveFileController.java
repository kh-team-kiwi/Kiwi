package com.kh.kiwi.s3file.controller;

import com.kh.kiwi.s3file.dto.FileDriveFileDTO;
import com.kh.kiwi.s3file.service.FileDriveFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
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

    @DeleteMapping("/{driveCode}/files/{fileCode}")
    public void deleteFile(@PathVariable String driveCode, @PathVariable String fileCode) {
        fileDriveFileService.deleteFile(driveCode, fileCode);
    }

    @PutMapping("/{driveCode}/files/{fileCode}")
    public void updateFileName(@PathVariable String driveCode, @PathVariable String fileCode, @RequestBody String newFileName) {
        fileDriveFileService.updateFileName(driveCode, fileCode, newFileName.replace("\"", "")); // 파일 이름 끝의 "" 제거
    }

    @GetMapping("/{driveCode}/files/{fileCode}/download")
    public ResponseEntity<byte[]> downloadFile(@PathVariable String driveCode, @PathVariable String fileCode) {
        byte[] fileData = fileDriveFileService.downloadFile(driveCode, fileCode);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", fileCode);

        return ResponseEntity.ok()
                .headers(headers)
                .body(fileData);
    }

    @PostMapping("/{driveCode}/folders/create")
    public ResponseEntity<Void> createFolder(@PathVariable String driveCode, @RequestBody Map<String, String> request) {
        String folderName = request.get("folderName");
        fileDriveFileService.createFolder(driveCode, folderName);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{driveCode}/folders/{folderCode}")
    public ResponseEntity<Void> deleteFolder(@PathVariable String driveCode, @PathVariable String folderCode) {
        fileDriveFileService.deleteFolder(driveCode, folderCode);
        return ResponseEntity.ok().build();
    }
}
