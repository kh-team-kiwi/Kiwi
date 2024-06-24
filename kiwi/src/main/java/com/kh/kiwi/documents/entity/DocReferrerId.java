package com.kh.kiwi.documents.entity;

import lombok.Data;

import java.io.Serializable;

@Data
public class DocReferrerId implements Serializable {
    private Long docNum;
    private Long companyNum;
    private String memberId;

}
