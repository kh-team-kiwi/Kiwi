package com.kh.kiwi.documents.entity;

import jakarta.persistence.*;

import jakarta.persistence.Entity;
import lombok.Data;

import java.time.LocalDate;

@Table(name="doc")
@Entity
@Data
public class Doc {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long docNum;

    private String creComEmpNum;
    private String docTitle;
    private LocalDate docDate;
    private String docSecurity;
    private String docType;
    private String companyNum;
    private String docContent;
    private String docCompletion;

}