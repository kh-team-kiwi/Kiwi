package com.kh.kiwi.s3drive.entity;

import java.io.Serializable;
import java.util.Objects;

public class DriveUsersId implements Serializable {

    private String driveCode;
    private String memberId;

    // Default constructor
    public DriveUsersId() {}

    // Parameterized constructor
    public DriveUsersId(String driveCode, String memberId) {
        this.driveCode = driveCode;
        this.memberId = memberId;
    }

    // Getters, setters, equals, and hashCode methods
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DriveUsersId that = (DriveUsersId) o;
        return driveCode.equals(that.driveCode) && memberId.equals(that.memberId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(driveCode, memberId);
    }
}
