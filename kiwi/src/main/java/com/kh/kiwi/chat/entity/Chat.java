package com.kh.kiwi.chat.entity;

import com.kh.kiwi.auth.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "chat")
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CHAT_NUM")
    private Integer chatNum;

    @Column(name = "CHAT_NAME", length = 30, nullable = false)
    private String chatName;

    @Column(name = "CHAT_OPEN", nullable = false, columnDefinition = "BOOLEAN DEFAULT 0")
    private Boolean chatOpen;

    @ManyToOne
    @JoinColumn(name = "CHAT_ADMIN_MEMBER_ID", referencedColumnName = "memberId", nullable = false)
    private Member chatAdminMember;

    @Column(name = "TEAM", length = 15, nullable = false)
    private String team;
}
