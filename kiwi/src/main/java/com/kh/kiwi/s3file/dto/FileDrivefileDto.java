package com.kh.kiwi.s3file.dto;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FileDrivefileDto {
    private String fileCode;
    private String team;
    private String fileName;
    private String filePath;
    private LocalDateTime uploadTime;
}
