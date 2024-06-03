package com.kh.kiwi.documents.dto;

import lombok.Data;

@Data
public class DocDto {
    private Long docNum;
    private String docTitle;
    private String docDate;
    private String docCompletion;
    private String docType;
}