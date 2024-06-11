package com.kh.kiwi.s3drive.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "file_drive")
public class FileDrive {

    @Id
    @Column(name = "DRIVE_CODE")
    private String driveCode;

    @Column(name = "DRIVE_NAME")
    private String driveName;

    @Column(name = "TEAM")
    private String team;

}


