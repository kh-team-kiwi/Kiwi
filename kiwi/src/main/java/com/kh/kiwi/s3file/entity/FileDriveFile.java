package com.kh.kiwi.s3file.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "FILE_DRIVE")
public class FileDriveFile {

    @Id
    private String fileCode;

    private String team;

    private String fileName;

    private String filePath;

    private LocalDateTime uploadTime;


}


