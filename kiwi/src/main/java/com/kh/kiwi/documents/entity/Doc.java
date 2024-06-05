package com.kh.kiwi.documents.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Table(name="doc")
@Entity
public class Doc {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long docNum;
    private String creComEmpNum;
    private String docTitle;
    private LocalDate docDate;
    private String docSecurity;
    private String docType;
}