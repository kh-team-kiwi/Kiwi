package com.kh.kiwi.aram.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Table(name="aram")
@Data
@ToString
public class Aram {
    @Id
    private String aramnum;
    private String memberId; // recivor
    private String sender;
    private String type;
    private String content;
    private LocalDateTime time;
    private String isconfirm;
}
