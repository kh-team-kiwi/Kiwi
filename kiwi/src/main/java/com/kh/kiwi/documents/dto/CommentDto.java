package com.kh.kiwi.documents.dto;

public class CommentDto {
    private String content;
    private String employeeNo; // 추가된 필드

    // Getters and setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getEmployeeNo() {
        return employeeNo;
    }

    public void setEmployeeNo(String employeeNo) {
        this.employeeNo = employeeNo;
    }
}
