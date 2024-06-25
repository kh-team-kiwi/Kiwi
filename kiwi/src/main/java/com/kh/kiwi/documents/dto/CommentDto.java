package com.kh.kiwi.documents.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentDto {
    private Long id; // 댓글 ID 추가
    private String content;
    private String employeeNo; // 댓글 작성자 번호
    private String employeeName; // 댓글 작성자 이름
    private LocalDateTime createdAt; // 댓글 작성 시간
}
