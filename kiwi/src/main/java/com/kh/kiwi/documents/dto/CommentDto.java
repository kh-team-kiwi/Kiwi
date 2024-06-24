package com.kh.kiwi.documents.dto;

public class CommentDto {
    private String content;
    private String employeeNo; // 댓글 작성자 번호 추가

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
