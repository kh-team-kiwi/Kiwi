package com.kh.kiwi.s3drive.dto;

import java.util.UUID;
import lombok.Data;

@Data
public class FileDriveDTO {

    private String driveCode; //aws 저장이름
    private String driveName; //원래 파일이름
    private String team; //팀이름

    // 기본 생성자
    public FileDriveDTO() {
        this.driveCode = UUID.randomUUID().toString();
    }

    // 매개변수를 받는 생성자 (driveCode 자동 생성)
    public FileDriveDTO(String driveName, String team) {
        this.driveCode = UUID.randomUUID().toString();
        this.driveName = driveName;
        this.team = team;
    }

    // 매개변수를 모두 받는 생성자
    public FileDriveDTO(String driveCode, String driveName, String team) {
        this.driveCode = driveCode;
        this.driveName = driveName;
        this.team = team;
    }
}
