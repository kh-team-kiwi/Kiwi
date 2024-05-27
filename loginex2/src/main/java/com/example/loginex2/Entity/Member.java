package com.example.loginex2.Entity;

import com.example.loginex2.Dto.SignUpDto;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name="MEMBER")
public class Member {
    @Id
    private String id;
    private String email;
    private String name;
    private String password;
    private String phoneNumber;
    private String userType;
    private LocalDateTime createdAt;
    private LocalDateTime editedAt;
    private LocalDateTime lastLoginAt;
    private String token;

    public Member(SignUpDto dto) {
        this.id = dto.getEmail();
        this.email = dto.getEmail();
        this.password = dto.getPassword();
        this.name = dto.getName();
        this.phoneNumber = "00000000";
        this.userType = "";
        this.token = "";
        this.createdAt = LocalDateTime.now();
        this.editedAt = LocalDateTime.now();
    }
}