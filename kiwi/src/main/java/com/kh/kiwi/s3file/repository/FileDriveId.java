package com.kh.kiwi.s3file.repository;

import java.io.Serializable;

import lombok.Data;
@Data
public class FileDriveId implements Serializable {
    private String fileCode;
    private String team;

}
