package com.kh.kiwi.s3file.controller;

import com.kh.kiwi.s3file.service.S3Service;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final S3Service s3Service;

    public FileController(S3Service s3Service) {
        this.s3Service = s3Service;
    }
    @PostMapping("/create-folder")
    public ResponseEntity<String> createFolder(@RequestParam("folderName") String folderName) {
        try {
            s3Service.createFolder(folderName);
            return ResponseEntity.ok("Successfully created folder - " + folderName);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to create folder");
        }
    }
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String key = s3Service.uploadFile(file);
            return ResponseEntity.ok("Successfully uploaded - " + key);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to upload file");
        }
    }

    @GetMapping("/download/{key}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable String key) {
        try {
            byte[] file = s3Service.downloadFile(key);
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
            s3Service.deleteFile(key);
            return ResponseEntity.ok("Successfully deleted - " + key);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to delete file");
        }
    }

    @PutMapping("/rename")
    public ResponseEntity<String> renameFile(@RequestParam("oldKey") String oldKey, @RequestParam("newKey") String newKey) {
        try {
            s3Service.renameFile(oldKey, newKey);
            return ResponseEntity.ok("Successfully renamed from " + oldKey + " to " + newKey);
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to rename file");
        }
    }
}
