package com.kh.kiwi.team.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Entity
@Table(name = "company")
@Getter
@Setter
@NoArgsConstructor
public class Company {
    @Id
    private String companyNum;

    @Column(name = "company")
    private String companyName;

    public Company(String companyNum, String companyName) {
        this.companyNum = companyNum;
        this.companyName = companyName;
    }

    @Query("SELECT c FROM Company c WHERE c.companyNum = :companyNum")
    Company findByCompanyNum(@Param("companyNum") String companyNum) {
        return null;
    }
}
