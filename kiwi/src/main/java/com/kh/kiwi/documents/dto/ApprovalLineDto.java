package com.kh.kiwi.documents.dto;

import lombok.Data;

import java.util.List;

@Data
public class ApprovalLineDto {
    private List<Approver> approvers;
    private List<Reference> references;

    @Data
    public static class Approver {
        private String employeeNo;
        private String name;
        private String position;
    }

    @Data
    public static class Reference {
        private String employeeNo;
        private String name;
    }
}
