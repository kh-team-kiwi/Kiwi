package com.kh.kiwi.s3file.controller;

import com.kh.kiwi.s3file.dto.FileDrivefileDto;
import com.kh.kiwi.s3file.service.FileDriveFileService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;



import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class FileDriveFileController {

    private final FileDriveFileService fileDriveFileService;

    @PostMapping("/upload")
    public ResponseEntity<List<FileDrivefileDto>> uploadFiles(@RequestParam("files") List<MultipartFile> files,
                                                              @RequestParam("team") String team) {
        List<FileDrivefileDto> uploadedFiles = new ArrayList<>();
        try {
            for (MultipartFile file : files) {
                FileDrivefileDto fileDTO = fileDriveFileService.uploadFile(file, team);
                uploadedFiles.add(fileDTO);
            }
            return ResponseEntity.ok(uploadedFiles);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<FileDrivefileDto>> listFiles() {
        List<FileDrivefileDto> files = fileDriveFileService.listFiles();
        return ResponseEntity.ok(files);
    }

    @GetMapping("/download/{key}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable String key) {
        try {
            byte[] file = fileDriveFileService.downloadFile(key);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + key + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(file);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null);
        }
    }
    @DeleteMapping("/delete/{key}")
    public ResponseEntity<String> deleteFile(@PathVariable String key) {
        try {
            fileDriveFileService.deleteFile(key);
            return ResponseEntity.ok("Successfully deleted - " + key);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to delete file");
        }
    }
    @PostMapping("/create-folder")
    public ResponseEntity<String> createFolder(@RequestParam("folderName") String folderName) {
        try {
            fileDriveFileService.createFolder(folderName);
            return ResponseEntity.ok("Successfully created folder - " + folderName);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to create folder");
        }
    }
    @DeleteMapping("/delete-folder")
    public ResponseEntity<String> deleteFolder(@RequestParam("folderName") String folderName) {
        try {
            fileDriveFileService.deleteFolder(folderName);
            return ResponseEntity.ok("Successfully deleted folder: " + folderName);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to delete folder");
        }
    }
}
