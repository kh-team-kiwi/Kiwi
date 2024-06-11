package com.kh.kiwi.s3file.dto;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FileDriveFileDTO {

    private String fileCode;
    private String driveCode;
    private String fileName;
    private String filePath;
    private boolean isFolder;
    private LocalDateTime uploadTime;

    // 생성자
    public FileDriveFileDTO() {
    }

    public FileDriveFileDTO(String fileCode, String driveCode, String fileName, String filePath, boolean isFolder, LocalDateTime uploadTime) {
        this.fileCode = fileCode;
        this.driveCode = driveCode;
        this.fileName = fileName;
        this.filePath = filePath;
        this.isFolder = isFolder;
        this.uploadTime = uploadTime;
    }
}