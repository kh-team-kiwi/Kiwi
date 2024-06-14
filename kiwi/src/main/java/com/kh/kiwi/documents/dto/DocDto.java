package com.kh.kiwi.documents.dto;

import lombok.Data;

@Data
public class DocDto {
    private Long docNum;
    private String docTitle;
    private Integer docStatus;
    private String docDate;
    private String docCompletion;
    private String docContents;
    private String name;
    private String scheduledDeletionDate;
    private String docType;
    private String employeeNo;
}
