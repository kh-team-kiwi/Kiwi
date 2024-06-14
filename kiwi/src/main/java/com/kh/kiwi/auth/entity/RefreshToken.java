package com.kh.kiwi.auth.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name="token")
public class RefreshToken {

    @Id
    @Column(name = "MEMBER_ID")
    private String username;
    @Column(name = "TOKEN")
    private String refresh;
    @Column(name = "EXPIRAY")
    private String expiration;
}