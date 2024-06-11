package com.kh.kiwi.s3file.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "file_drive_file")
public class FileDriveFile {

    @Id
    @Column(name = "FILE_CODE")
    private String fileCode;

    @Column(name = "DRIVE_CODE")
    private String driveCode;

    @Column(name = "FILE_NAME")
    private String fileName;

    @Column(name = "FILE_PATH")
    private String filePath;

    @Column(name = "UPLOAD_TIME")
    private LocalDateTime uploadTime;

    @Column(name = "IS_FOLDER")
    private boolean isFolder;

    // Getters and setters
}
