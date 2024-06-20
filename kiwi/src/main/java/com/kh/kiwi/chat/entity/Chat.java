package com.kh.kiwi.chat.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "chat")
@Getter
@Setter
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chat_num")
    private Integer chatNum;

    @Column(name = "chat_name")
    private String chatName;

    @Column(name = "chat_open")
    private Boolean chatOpen;

    @Column(name = "chat_admin_member_id")
    private String chatAdminMemberId;

    @Column(name = "team")
    private String team;
}
