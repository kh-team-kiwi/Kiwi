package com.kh.kiwi.s3file.controller;

import com.kh.kiwi.s3file.dto.FileDriveFileDTO;
import com.kh.kiwi.s3file.service.FileDriveFileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private static final Logger log = LoggerFactory.getLogger(FileDriveFileService.class);
    private final FileDriveFileService fileDriveFileService;

    @Autowired
    public FileDriveFileController(FileDriveFileService fileDriveFileService) {
        this.fileDriveFileService = fileDriveFileService;
    }

    @GetMapping("/{teamno}/{driveCode}/files")
    public List<FileDriveFileDTO> getFiles(@PathVariable String teamno, @PathVariable String driveCode, @RequestParam(required = false) String parentPath) {
        // parentPath가 null이거나 비어 있으면 빈 문자열로 설정
        String adjustedParentPath = (parentPath != null) ? parentPath : "";
        return fileDriveFileService.getFilesByDriveCodeAndPath(driveCode, adjustedParentPath, teamno);
    }


    @PostMapping("/{driveCode}/files/upload")
    public List<FileDriveFileDTO> uploadFiles(@PathVariable String driveCode, @RequestParam("files") MultipartFile[] files, @RequestParam(required = false) String parentPath, @RequestParam String teamNumber) {
        return Arrays.stream(files)
                .map(file -> fileDriveFileService.uploadFile(driveCode, file, parentPath, teamNumber))
                .collect(Collectors.toList());
    }

    @DeleteMapping("/{driveCode}/files/{fileCode}")
    public void deleteFile(@PathVariable String driveCode, @PathVariable String fileCode, @RequestParam(required = false) String parentPath) {
        fileDriveFileService.deleteFile(driveCode, fileCode, parentPath);
    }

    @PutMapping("/{driveCode}/files/{fileCode}")
    public void updateFileName(@PathVariable String driveCode, @PathVariable String fileCode, @RequestBody String newFileName, @RequestParam(required = false) String parentPath) {
        fileDriveFileService.updateFileName(driveCode, fileCode, newFileName.replace("\"", ""), parentPath);
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
        String parentPath = request.get("parentPath");
        String teamNumber = request.get("teamNumber");

        if (parentPath == null || parentPath.isEmpty()) {
            parentPath = "";
        }

        log.info("Creating folder with driveCode: {}, folderName: {}, parentPath: {}, teamNumber: {}", driveCode, folderName, parentPath, teamNumber);

        fileDriveFileService.createFolder(driveCode, folderName, parentPath, teamNumber);
        return ResponseEntity.ok().build();
    }


    @DeleteMapping("/{driveCode}/folders/{folderCode}")
    public ResponseEntity<Void> deleteFolder(@PathVariable String driveCode, @PathVariable String folderCode, @RequestParam(required = false) String parentPath) {
        fileDriveFileService.deleteFolder(driveCode, folderCode, parentPath);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{driveCode}/folders/{folderCode}")
    public void updateFolderName(@PathVariable String driveCode, @PathVariable String folderCode, @RequestBody String newFolderName, @RequestParam(required = false) String parentPath) {
        fileDriveFileService.updateFolderName(driveCode, folderCode, newFolderName.replace("\"", ""), parentPath);
    }
}
