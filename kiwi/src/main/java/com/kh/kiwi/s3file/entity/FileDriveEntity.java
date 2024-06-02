package com.kh.kiwi.s3file.entity;

import java.time.LocalDateTime;

import com.kh.kiwi.s3file.repository.FileDriveId;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "FILE_DRIVE")
@Data
@IdClass(FileDriveId.class)
public class FileDriveEntity {

    @Id
    private String fileCode;

    @Id
    private String team;

    private String fileName;

    private String filePath;

    private LocalDateTime uploadTime;


}


