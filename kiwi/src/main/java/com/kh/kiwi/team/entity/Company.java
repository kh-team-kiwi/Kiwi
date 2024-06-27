package com.kh.kiwi.team.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "company")
@Getter
@Setter
@NoArgsConstructor
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "COMPANY_NUM")
    private Integer companyNum;

    @Column(name = "COMPANY", nullable = false)
    private String companyName;

    public Company(String companyName) {
        this.companyName = companyName;
    }
}
