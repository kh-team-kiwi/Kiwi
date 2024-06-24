package com.kh.kiwi.s3drive.entity;

import jakarta.persistence.*;


@Entity
@Table(name = "drive_users")
@IdClass(DriveUsersId.class)
public class DriveUsers {

    @Id
    private String driveCode;

    @Id
    private String memberId;

    // Getters and Setters
    public String getDriveCode() {
        return driveCode;
    }

    public void setDriveCode(String driveCode) {
        this.driveCode = driveCode;
    }

    public String getMemberId() {
        return memberId;
    }

    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }
}
