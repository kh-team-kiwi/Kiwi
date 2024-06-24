package com.kh.kiwi.s3drive.dto;

import java.util.List;

public class CreateDriveRequest {

    private FileDriveDTO fileDriveDTO;
    private List<String> userIds;

    // 기본 생성자
    public CreateDriveRequest() {}

    // 매개변수를 받는 생성자
    public CreateDriveRequest(FileDriveDTO fileDriveDTO, List<String> userIds) {
        this.fileDriveDTO = fileDriveDTO;
        this.userIds = userIds;
    }

    // Getters and Setters
    public FileDriveDTO getFileDriveDTO() {
        return fileDriveDTO;
    }

    public void setFileDriveDTO(FileDriveDTO fileDriveDTO) {
        this.fileDriveDTO = fileDriveDTO;
    }

    public List<String> getUserIds() {
        return userIds;
    }

    public void setUserIds(List<String> userIds) {
        this.userIds = userIds;
    }
}
